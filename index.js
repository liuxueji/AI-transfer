// var Prompt = "Sunset cliffs";
// var Prompt = "Never ending flower";
// var Prompt = "Fire and water";
// var Prompt = "DNA tornado";
// var Prompt = "Groovy times";
// var Prompt = "Dream within a dream";
var Prompts = ["Sunset cliffs","Never ending flower","Fire and water","DNA tornado","Groovy times","Dream within a dream"]
var n = 0;
var Style = 35;
var Weigth = "HIGH";//  "LOW" "MEDIUM" "HIGH"
var Path_Import = String.raw`./Import`;
var Path_Export = String.raw`./Export`;
var Frequency = 10;
var Img = true;
var count = 0

const { buildDefaultInstance } = require('wombo-dream-api');
const fs = require('fs');
const https = require("https");
var files = fs.readdirSync(Path_Import); // './Craft/'
// console.log(files);
files = shuffle(files);


function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

setInterval(run, 10000);

async function run() {
    
    // console.log(Style++)
    // console.log(Prompts[n++])
    try {
        const credentials = {
            email: 'zlri303g@idrrate.com',
            // email: 'palerex602@keshitv.com',
            // email: '1290746759@qq.com',
            password: 'abc123456',
        };

        // signin is automatically done when you interract with the api if you pass credentials
        const wombo = buildDefaultInstance(credentials);

        // if you want to sign up as new user:
        // await wombo.authentifier.signUp(credentials);

        // fetch all styles
        const styles = await wombo.fetchStyles();
        // console.log(styles.map((style) => `[${style.id}] ${style.name}`));



        for (const filename of files) {

            // console.log(filename);

            // upload image [ONLY JPEG SUPPORTED]
            const uploadedImage = await wombo.uploadImage(
                 fs.readFileSync(Path_Import +"/"+ filename)
                // fs.readFileSync('./image.png')
            );


            console.log("***")
            console.log(Prompts[n])
            console.log(styles[Style].name)
            const prompt = Prompts[n]
            const styleName = styles[Style].name
            // generate picture from image
            const generatedTask = await wombo.generatePicture(
                Prompts[n],
                styles[Style].id,
                (taskInProgress) => {
                    // console.log(
                    //     `[${taskInProgress.id}]: ${taskInProgress.state} | step: ${taskInProgress.photo_url_list.length}`
                    // );
                },
                { mediastore_id: uploadedImage.id, weight: Weigth, frequency: Frequency } //

            );
            console.log(
                `[${generatedTask.id}]: ${generatedTask.state} | final url: ${generatedTask.result?.final}`
            );

            // to interract with the gallery, YOU NEED TO HAVE A USERNAME!
            // if you just created the account and it doesn't have a username, set it with:
            // await wombo.setUsername('myusername');

            // save an image in the gallery
            const savedTask = await wombo.saveTaskToGallery(
                generatedTask.id,
                'my wonderful creation',
                true,
                true
            );

            console.log('image saved!');
            console.log(count++)

            // URL of the image
            const url = generatedTask.result?.final;

            https.get(url, (res) => {
                const path = Path_Export + "/" + filename +"/"+ styleName + "/" + prompt + "-" + generatedTask.id + ".jpeg";
                // const path = Path_Export + "/" + filename + "-" + Prompts[n] + "-" + generatedTask.id + ".jpeg";
                const writeStream = fs.createWriteStream(path);

                res.pipe(writeStream);

                writeStream.on("finish", () => {
                    writeStream.close();
                    console.log("Download Completed");
                });
            });
            

            
            
            if(++Style == 40) Style = 0
            if(++n == 6) n = 0

        }




        // obtain gallery tasks
        const galleryTasks = await wombo.fetchGalleryTasks();

        //console.log(galleryTasks);
    } catch (error) {
        console.error(error);
    }
}

// goonous
// (async () => {
//     try {
//         const credentials = {
//             email: 'palerex602@keshitv.com',
//             password: 'abc123456',
//         };

//         // signin is automatically done when you interract with the api if you pass credentials
//         const wombo = buildDefaultInstance(credentials);

//         // if you want to sign up as new user:
//         // await wombo.authentifier.signUp(credentials);

//         // fetch all styles
//         const styles = await wombo.fetchStyles();
//         // console.log(styles.map((style) => `[${style.id}] ${style.name}`));



//         for (const filename of files) {

//             console.log(filename);

//             // upload image [ONLY JPEG SUPPORTED]
//             const uploadedImage = await wombo.uploadImage(
//                  fs.readFileSync(Path_Import +"/"+ filename)
//                 // fs.readFileSync('./image.png')
//             );

//             // generate picture from image
//             const generatedTask = await wombo.generatePicture(
//                 Prompt,
//                 styles[Style].id,
//                 (taskInProgress) => {
//                     console.log(
//                         `[${taskInProgress.id}]: ${taskInProgress.state} | step: ${taskInProgress.photo_url_list.length}`
//                     );
//                 },
//                 { mediastore_id: uploadedImage.id, weight: Weigth, frequency: Frequency } //

//             );


//             console.log(
//                 `[${generatedTask.id}]: ${generatedTask.state} | final url: ${generatedTask.result?.final}`
//             );

//             // to interract with the gallery, YOU NEED TO HAVE A USERNAME!
//             // if you just created the account and it doesn't have a username, set it with:
//             // await wombo.setUsername('myusername');

//             // save an image in the gallery
//             const savedTask = await wombo.saveTaskToGallery(
//                 generatedTask.id,
//                 'my wonderful creation',
//                 true,
//                 true
//             );

//             console.log('image saved!');

//             // URL of the image
//             const url = generatedTask.result?.final;

//             https.get(url, (res) => {
//                 const path = Path_Export + "/" + filename + generatedTask.id + ".jpeg";
//                 const writeStream = fs.createWriteStream(path);

//                 res.pipe(writeStream);

//                 writeStream.on("finish", () => {
//                     writeStream.close();
//                     console.log("Download Completed");
//                 });
//             });

//         }




//         // obtain gallery tasks
//         const galleryTasks = await wombo.fetchGalleryTasks();

//         //console.log(galleryTasks);
//     } catch (error) {
//         console.error(error);
//     }
// })();
