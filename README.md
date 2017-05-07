# Spiral Creator
Create your own spiral galaxy (with the density wave model) and compare it with real galaxies

## How to run it?

You need to have nodejs and npm installed on your computer. On a debian/ubuntu computer, you can install them with:
```bash
sudo apt-get install nodejs npm
```

Then, run the following commands in the root folder :
```bash
npm install
npm test
npm run serve
```

The site will be accessible at http://127.0.0.1:8080

## How to develop it?

This application uses ES2016 version of Javascript, so you need to compile it in order to see it on a web browser.
In order to develop without worrying about compilation, just execute:
```bash
npm run watch
```
and it will watch for any change in the code and compile it in real time.
