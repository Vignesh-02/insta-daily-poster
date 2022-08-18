const express= require('express');
const app= express();
const Instagram = require('instagram-web-api');
const FileCookieStore = require('tough-cookie-filestore2');
const cron = require('node-cron');
const wordPOS = require('wordpos');
const wordpsos = new wordPOS();

require('dotenv').config();

const port  = process.env.PORT || 4000;

cron.schedule("* * * * *",async () => {
    const cookieStore = new FileCookieStore("./cookies.json");

const client = new Instagram(
  { username: process.env.USERNAME,
    password: process.env.PASSWORD,
    cookieStore,
  },
    {
        language: 'en-US',
    }
); 

const instagramPostFunction = async () => {
        // wordpsos.randAdjective({count: 1}, async(result)=>{
        //     const resultWord = result[0].replace("_"," ");
        // });
        await client.uploadPhoto({
            photo: './kitchen1.jpg',
            caption: 'new kitchen',
            post: "feed",
        }).then(async (res) => {
          const media=res.media;

          console.log(`https://instagram.com/p/${media.code}`);

          await client.addComment({
            mediaId: media.id,
            text: 'Amazing kitchen setup' ,

        });
    });
    };

const loginFunction = async () => {
    console.log('logging in');
    await client.login().then(() => {
        console.log('Log in successful');
        instagramPostFunction();
    }).catch(err => {
        console.log("Login Failed");
        console.log(err);
    })
};

loginFunction();

});

 //persist logged in session

app.listen(port, ()=>{ 
    console.log(`Server is running on port ${port}`);
}   );

