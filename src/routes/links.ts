import express from 'express';

import { addLink, updateLink, removeLink, getUserLinks, visitLink } from '../controllers/link';

const linksRouter = express.Router();

linksRouter.route('/link').post(addLink);
linksRouter.route('/link').put(updateLink);
linksRouter.route('/link').delete(removeLink);
linksRouter.route('/link/:userName').get(getUserLinks);
linksRouter.route('/:shortURL').get(visitLink);

export { linksRouter };
