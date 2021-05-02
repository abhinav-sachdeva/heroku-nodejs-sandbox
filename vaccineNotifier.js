require('dotenv').config()
const moment = require('moment');
const cron = require('node-cron');
const axios = require('axios');
const notifier = require('./notifier');
/**
Step 1) Enable application access on your gmail with steps given here:
 https://support.google.com/accounts/answer/185833?p=InvalidSecondFactor&visit_id=637554658548216477-2576856839&rd=1

Step 2) Enter the details in the file .env, present in the same folder

Step 3) On your terminal run: npm i && pm2 start vaccineNotifier.js

To close the app, run: pm2 stop vaccineNotifier.js && pm2 delete vaccineNotifier.js
 */

const PINCODE = process.env.PINCODE
const EMAIL = process.env.EMAIL
const AGE = process.env.AGE
const ageLimit = '19'
const appointmentsListLimit = 2
async function main() {
    try {
        cron.schedule('*/10  * * * *', async () => {
            await checkAvailability();
        });
    } catch (e) {
        console.log('an error occured: ' + JSON.stringify(e, null, 2));
        throw e;
    }
}

async function checkAvailability() {

    let datesArray = await fetchNext10Days();
    let districtIds = [140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 199, 188]
    districtIds.forEach((districtId) => {
        datesArray.forEach(date => {
            pingCowin(districtId, date);
        })
    })

}
let counter = 0
function pingCowin(districtId, date) {
    console.log("ping", districtId, date)
    axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtId}&date=${date}`).then((result) => {
        const { centers } = result.data;
        let isSlotAvailable = false;
        let dataOfSlot = "";
        let appointmentsAvailableCount = 0;
        let centerName = ""
        let sessionName = ""
        if (centers.length) {
            centers.forEach(center => {
                center.sessions.forEach((session => {
                    if (session.min_age_limit < ageLimit && session.available_capacity > 0 && session.vaccine.toUpperCase() == "COVAXIN") {

                        isSlotAvailable = true
                        appointmentsAvailableCount++;
                        if (appointmentsAvailableCount <= appointmentsListLimit) {
                            dataOfSlot = `${dataOfSlot}\nSlot for ${session.available_capacity} is available: ${center.name} on ${session.date}`;
                            centerName = center.name
                            sessionName = session.date
                        }
                    }
                }))
            });

            dataOfSlot = `${dataOfSlot}\n${appointmentsAvailableCount - appointmentsListLimit} more slots available...`
        }
        if (isSlotAvailable) {
            notifyMe(dataOfSlot, centerName, sessionName)

            // axios.post(`https://maker.ifttt.com/trigger/${iftttWebhookName}/with/key/${iftttWebhookKey}`, { value1: dataOfSlot }).then(() => {
            //     console.log('Sent Notification to Phone \nStopping Pinger...')
            //     clearInterval(timer);
            // });
        }
    }).catch((err) => {
        console.log("Error: " + err.message);
    });
}

// function getSlotsForDate(DATE) {
//     let config = {
//         method: 'get',
//         url: 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=' + PINCODE + '&date=' + DATE,
//         headers: {
//             'accept': 'application/json',
//             'Accept-Language': 'hi_IN'
//         }
//     };

//     axios(config)
//         .then(function (slots) {
//             let sessions = slots.data.sessions;
//             let validSlots = sessions.filter(slot => slot.min_age_limit <= AGE &&  slot.available_capacity > 0)
//             console.log({date:DATE, validSlots: validSlots.length})
//             if(validSlots.length > 0) {
//                 notifyMe(validSlots);
//             }
//         })
//         .catch(function (error) {
//             console.log(error);
//         });
// }

async function

    notifyMe(validSlots, centername, centerdate) {
    notifier.sendEmail(EMAIL, `${centername}: ${centerdate}`, validSlots, (err, result) => {
        if (err) {
            console.error({ err });
        }
    })
};

async function fetchNext10Days() {
    let dates = [];
    let today = moment();
    for (let i = 0; i < 10; i++) {
        let dateString = today.format('DD-MM-YYYY')
        dates.push(dateString);
        today.add(1, 'day');
    }
    return dates;
}


main()
    .then(() => { console.log('Vaccine availability checker started.'); });
