import express from "express";

export abstract class commonRouteConfig {
  app: express.Application;
  name: string;

  // constructor(private app: express.Application, private name: string) {}

  constructor(app: express.Application, name: string) {
    this.app = app;
    this.name = name;
    this.configureRoutes();
  }

  getName() {
    return this.name;
  }

  abstract configureRoutes(): express.Application;
}
