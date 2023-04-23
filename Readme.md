### Initial commit authored by Jasmine Chen

# Pgg

# Running this App Locally

## General Setup

If you haven't already:

- Install `Empirica`: https://docs.empirica.ly/getting-started/setup

## Preparing this app

If you have just downloaded, pulled, or cloned this app, you should run this in the command line to install all the Node packages:

```
cd client
empirica npm install
cd ../server
empirica npm install
cd ..
```

## Launching the app

You can now run the app on your local machine with:

```
empirica
```

This will start the app that you can access as a participant:
[https:/localhost:3000/](https:/localhost:3000/)

You can access the admin panel here:
[https:/localhost:3000/admin](https:/localhost:3000/admin)

## Loading the factors and treatments

Factors and treatments are found in `.empirica/treatments.yaml`.

## Testing the app

To run a game create a new `batch` with the games of treatments you want to use and click start on the batch.

Open a player tab by going to [https:/localhost:3000/](https:/localhost:3000/) or clicking on **open app**.

The player that you open with [https:/localhost:3000/](https:/localhost:3000/) is cached on your browser. Whenever you start a game with this player, your local app will keep that information. To play again there are multiple things you can do:

- Click on the **Reset current session** button on the header of a tab with your player to reset this player, and create a new game for this player to join.
- Click on the **New Player** button on the header of a tab with your player to open a new tab with a different player (you will see the id of that player in the title of the tab).
- Go to the **Players** tab in the admin panel and retire players that have finished or cancelled.

**The app will hot reload as you save changes to your code.**

# Learn more

- Empirica Website: [https://empirica.ly/](https://empirica.ly/)
- Empirica documentation: [https://docs.empirica.ly/](https://docs.empirica.ly/)
- Meteor Tutorial: [https://www.meteor.com/tutorials/react/creating-an-app](https://www.meteor.com/tutorials/react/creating-an-app)
- React Tutorial: [https://reactjs.org/tutorial/tutorial.html](https://reactjs.org/tutorial/tutorial.html)
- LESS Intro: [http://lesscss.org/#overview](http://lesscss.org/#overview)
- JavaScript Tutorial: [https://javascript.info/](https://javascript.info/)

# Ladle Stories

Ladle is used to test the UI elements. But it required a later version of react,
so it was seperated into a folder called stories. To run the stories, first
update npm once, in stories:

```sh
> cd stories; npm i; cd ..
```

Then, when you want to run the stories:

```sh
npm run stories
```
