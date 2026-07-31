import express from "express";

const express = express();

router.get("/login", authController.showLogin);
router.post("/login", authController.login);

router.get("/signup", authController.showSignup);
router.post("/signup", authController.signup);