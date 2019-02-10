# Step by step

This guide describes all the steps necessary to recreate the state of the project.

* Check installed versions of NodeJS and npm

```
$ node -v
v8.11.2
```
```
$ npm -v
5.6.0
```

* Install latest version of Angular CLI

```
$ npm install -g @angular/cli
+ @angular/cli@7.3.1
```

* Initialize project

```
ng new amphibian7 --service-worker
```

* Turn app into progressive web app

```
ng add @angular/pwa --project amphibian7
```