import express from 'express';

import { generateShortLink } from '../utils/utils';

import { LinkRecord } from '../types/links';
import {
  addRecord,
  getRecordsByUser,
  updateRecordShortURL,
  deleteRecordByShortLink,
  visitShortLink,
  isUniqueShortLink,
  isUserOwnerOfShortLink,
  isValidUser,
} from '../database/operations';
import { validateURL, validateUserName, validateIsRandomGenerated, validateShortURL } from '../utils/validate';
import {
  INTERNAL_SERVER_ERROR_ERROR_MSG,
  INVALID_SHORT_URL_ERROR_MSG,
  INVALID_OLD_SHORT_URL_BODY_ERROR_MSG,
  INVALID_NEW_SHORT_URL_BODY_ERROR_MSG,
  INVALID_LONG_URL_BODY_ERROR_MSG,
  INVALID_USER_NAME_BODY_ERROR_MSG,
  INVALID_USER_NAME_PARAM_ERROR_MSG,
  INVALID_IS_RANDOM_GENERATED_BODY_ERROR_MSG,
  DUPLICATE_SHORT_URL_ERROR_MSG,
  NOT_OWNER_SHORT_URL_ERROR_MSG,
  RECORD_NOT_UPDATED_ERROR_MSG,
  RECORD_NOT_DELETED_ERROR_MSG,
  NOT_EXIST_SHORT_URL_ERROR_MSG,
  NOT_EXIST_USERNAME_ERROR_MSG,
} from '../utils/errors';

export const addLink = (req: express.Request, res: express.Response) => {
  try {
    const longURL = req.body.longURL;
    const userName = req.body.userName;
    const isRandomGenerated = req.body.isRandomGenerated;
    const userDefinedShortURL = req.body.userDefinedShortURL;
    const validationErrors: Array<String> = [];

    // input validation
    if (!validateUserName(userName)) {
      validationErrors.push(INVALID_USER_NAME_BODY_ERROR_MSG);
    }
    if (!validateURL(longURL)) {
      validationErrors.push(INVALID_LONG_URL_BODY_ERROR_MSG);
    }
    if (!validateIsRandomGenerated(isRandomGenerated)) {
      validationErrors.push(INVALID_IS_RANDOM_GENERATED_BODY_ERROR_MSG);
    }
    if (!isRandomGenerated && !validateShortURL(userDefinedShortURL)) {
      validationErrors.push(INVALID_SHORT_URL_ERROR_MSG);
    }
    if (validationErrors.length > 0) {
      return res.status(400).send(validationErrors);
    }

    let newShortURL = isRandomGenerated ? generateShortLink() : userDefinedShortURL;

    // generate a new short url if there is a collision
    while (isRandomGenerated && !isUniqueShortLink(newShortURL)) {
      newShortURL = generateShortLink();
    }

    // check that the user defined short url is unique
    if (!isRandomGenerated && !isUniqueShortLink(newShortURL)) {
      return res.status(409).send(DUPLICATE_SHORT_URL_ERROR_MSG);
    }

    const newLinkRecord: LinkRecord = {
      user: userName,
      shortURL: newShortURL,
      longURL,
      clicks: 0,
    };

    const addedRecord: LinkRecord = addRecord(newLinkRecord);
    return res.status(201).send(addedRecord);
  } catch (error) {
    return res.status(500).send(INTERNAL_SERVER_ERROR_ERROR_MSG);
  }
};

export const getUserLinks = (req: express.Request, res: express.Response) => {
  try {
    const userName = req.params.userName;
    const validationErrors: Array<String> = [];

    // input validation
    if (!validateShortURL(userName)) {
      validationErrors.push(INVALID_USER_NAME_PARAM_ERROR_MSG);
    }
    if (validationErrors.length > 0) {
      return res.status(400).send(validationErrors);
    }

    // check that the user exists
    if (!isValidUser(userName)) {
      return res.status(404).send(NOT_EXIST_USERNAME_ERROR_MSG);
    }

    const allUserRecords = getRecordsByUser(userName);
    return res.send(allUserRecords);
  } catch (error) {
    return res.status(500).send(INTERNAL_SERVER_ERROR_ERROR_MSG);
  }
};

export const updateLink = (req: express.Request, res: express.Response) => {
  try {
    const userName = req.body.userName;
    const oldShortURL = req.body.oldShortURL;
    const newShortURL = req.body.newShortURL;
    const validationErrors: Array<String> = [];

    // input validation
    if (!validateUserName(userName)) {
      validationErrors.push(INVALID_USER_NAME_BODY_ERROR_MSG);
    }
    if (!validateShortURL(oldShortURL)) {
      validationErrors.push(INVALID_OLD_SHORT_URL_BODY_ERROR_MSG);
    }
    if (!validateShortURL(newShortURL)) {
      validationErrors.push(INVALID_NEW_SHORT_URL_BODY_ERROR_MSG);
    }
    if (validationErrors.length > 0) {
      return res.status(400).send(validationErrors);
    }

    // check if the user exists, short link exists and is owned by this user
    if (!isValidUser(userName)) {
      return res.status(404).send(NOT_EXIST_USERNAME_ERROR_MSG);
    }
    if (!isUniqueShortLink(newShortURL)) {
      return res.status(409).send(DUPLICATE_SHORT_URL_ERROR_MSG);
    }
    if (!isUserOwnerOfShortLink(userName, oldShortURL)) {
      return res.status(409).send(NOT_OWNER_SHORT_URL_ERROR_MSG);
    }

    try {
      const updatedRecord: LinkRecord = updateRecordShortURL(oldShortURL, newShortURL);
      return res.send(updatedRecord);
    } catch (error) {
      return res.status(400).send(RECORD_NOT_UPDATED_ERROR_MSG);
    }
  } catch (error) {
    return res.status(500).send(INTERNAL_SERVER_ERROR_ERROR_MSG);
  }
};

export const removeLink = (req: express.Request, res: express.Response) => {
  try {
    const userName = req.body.userName;
    const shortURL = req.body.shortURL;
    const validationErrors: Array<String> = [];

    // input validation
    if (!validateUserName(userName)) {
      validationErrors.push(INVALID_USER_NAME_BODY_ERROR_MSG);
    }
    if (!validateShortURL(shortURL)) {
      validationErrors.push(INVALID_SHORT_URL_ERROR_MSG);
    }
    if (validationErrors.length > 0) {
      return res.status(400).send(validationErrors);
    }

    // check if user exists and the short link is owned by this user
    if (!isValidUser(userName)) {
      return res.status(404).send(NOT_EXIST_USERNAME_ERROR_MSG);
    }
    if (!isUserOwnerOfShortLink(userName, shortURL)) {
      return res.status(409).send(NOT_OWNER_SHORT_URL_ERROR_MSG);
    }

    try {
      const deletedRecord: LinkRecord = deleteRecordByShortLink(shortURL);
      return res.send(deletedRecord);
    } catch (error) {
      return res.status(400).send(RECORD_NOT_DELETED_ERROR_MSG);
    }
  } catch (error) {
    return res.status(500).send(INTERNAL_SERVER_ERROR_ERROR_MSG);
  }
};

export const visitLink = (req: express.Request, res: express.Response) => {
  try {
    const shortURL = req.params.shortURL;
    const validationErrors: Array<String> = [];

    // input validation
    if (!validateShortURL(shortURL)) {
      validationErrors.push(INVALID_SHORT_URL_ERROR_MSG);
    }
    if (validationErrors.length > 0) {
      return res.status(400).send(validationErrors);
    }

    // check if the short link exists
    if (isUniqueShortLink(shortURL)) {
      return res.status(404).send(NOT_EXIST_SHORT_URL_ERROR_MSG);
    }

    // increment clicks and redirect to the long link
    const longURL = visitShortLink(shortURL);
    return res.redirect(longURL);
  } catch (error) {
    return res.status(500).send(INTERNAL_SERVER_ERROR_ERROR_MSG);
  }
};
