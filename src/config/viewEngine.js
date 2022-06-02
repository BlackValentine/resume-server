import express from 'express';

let configViewEngine = (app) => {
  app.use(express.static('./src/public'))
}

export default configViewEngine;