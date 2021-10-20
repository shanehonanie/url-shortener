import fs from 'fs';

import { LinkRecord } from '../types/links';

const DB_PATH = './src/database/data.json';

export const addRecord = (newRecord: LinkRecord): LinkRecord => {
  try {
    // get all existing records from disk to memory
    let allExistingRecords: Array<LinkRecord> = getAllRecords();

    // add the new record in memory
    allExistingRecords.push(newRecord);

    // save back to disk
    fs.writeFileSync(DB_PATH, JSON.stringify(allExistingRecords, null, 2), 'utf-8');
    return newRecord;
  } catch (error) {
    throw new Error();
  }
};

export const getRecordsByUser = (userName: string): Array<LinkRecord> => {
  // get all records and filter only the ones that belong to the user
  const allExistingRecords: Array<LinkRecord> = getAllRecords();
  return allExistingRecords.filter((record) => record.user === userName);
};

export const updateRecordShortURL = (oldShortURL: string, newShortURL: string): LinkRecord => {
  try {
    // get all existing records from disk to memory
    let allExistingRecords: Array<LinkRecord> = getAllRecords();

    // update the record
    const indexToUpdate: number = allExistingRecords.findIndex((record) => record.shortURL === oldShortURL);
    allExistingRecords[indexToUpdate].shortURL = newShortURL;

    // save back to disk
    fs.writeFileSync(DB_PATH, JSON.stringify(allExistingRecords, null, 2), 'utf-8');
    return allExistingRecords[indexToUpdate];
  } catch (error) {
    throw new Error('test error');
  }
};

export const deleteRecordByShortLink = (shortURL: string): LinkRecord => {
  // get all existing records from disk to memory
  let allExistingRecords: Array<LinkRecord> = getAllRecords();

  // update the record and save to disk
  const indexToDelete: number = allExistingRecords.findIndex((record) => record.shortURL === shortURL);
  const deletedRecord: Array<LinkRecord> = allExistingRecords.splice(indexToDelete, 1);
  fs.writeFileSync(DB_PATH, JSON.stringify(allExistingRecords, null, 2), 'utf-8');
  return deletedRecord[0];
};

export const visitShortLink = (shortURL: string): string => {
  try {
    // get all existing records from disk to memory
    let allExistingRecords: Array<LinkRecord> = getAllRecords();

    // update the record
    const indexToUpdate: number = allExistingRecords.findIndex((record) => record.shortURL === shortURL);
    allExistingRecords[indexToUpdate].clicks++;

    // save back to disk
    fs.writeFileSync(DB_PATH, JSON.stringify(allExistingRecords, null, 2), 'utf-8');
    return allExistingRecords[indexToUpdate].longURL;
  } catch (error) {
    throw new Error();
  }
};

export const isValidUser = (userName: string): boolean => {
  const allExistingRecords = getAllRecords();
  return allExistingRecords.some((record) => record.user === userName);
};

export const isUniqueShortLink = (shortLinkToCheck: string): boolean => {
  const allExistingRecords = getAllRecords();
  return !allExistingRecords.some((record) => record.shortURL === shortLinkToCheck);
};

// prerequisite: should check the the links exists by calling isUniqueShortLink
export const isUserOwnerOfShortLink = (userName: string, shortLinkToCheck: string): boolean => {
  const allExistingRecords = getAllRecords();
  const foundShortLink = allExistingRecords.find((record) => record.shortURL === shortLinkToCheck);
  return foundShortLink?.user === userName;
};

const getAllRecords = (): Array<LinkRecord> => {
  try {
    const jsonString = fs.readFileSync(DB_PATH);
    const allRecords = JSON.parse(jsonString.toString());
    return allRecords;
  } catch (err) {
    return [];
  }
};
