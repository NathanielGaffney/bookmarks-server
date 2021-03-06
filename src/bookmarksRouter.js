const express = require('express');
const logger = require('./logger');
const { store } = require('./store');
const { v4: uuid } = require('uuid');

const bookmarksRouter = express.Router()

bookmarksRouter
    .route('/bookmarks')
    .get((req, res) => {
        res.json(store)
    })
    .post((req, res) => {
        const { title, url, desc } = req.body;
        if (!title) {
            logger.error('Title is required');
            return res
                .status(400)
                .send('Invalid data');
        }
        if (!url) {
            logger.error('URL is required');
            return res
                .status(400)
                .send('Invalid data');
        }
        if (!desc) {
            logger.error('Description is required')
            return res
                .status(400)
                .send('Invalid data')
        }
        const id = uuid();
        const bookmark = {
            id: id,
            title: title,
            url: url,
            desc: desc
        }
        store.push(bookmark);

        logger.info(`Bookmark with id ${id} created`)

        res
            .status(201)
            .location(`http://localhost/8000/bookmarks/${id}`)
            .json(bookmark);
    });

bookmarksRouter
    .route('/bookmarks/:id')
    .get((req, res) => {
        const { id } = req.params;
        const bookmark = store.find(b => b.id == id)

        if (!bookmark) {
            logger.error(`Bookmark with id ${id} not found.`)
            return res
                .status(404)
                .send('Bookmark not found.')
        }
        res.json(bookmark)
    })

    .delete((req, res) => {
        const { id } = req.params;

        const bookmarkIndex = store.findIndex(x => x.id == id);
        if (bookmarkIndex === -1) {
            logger.error(`Bookmark with id ${id} not found.`);
            return res
                .status(404)
                .send('Not Found');
        }
        store.splice(bookmarkIndex, 1);

        logger.info(`List with id ${id} deleted.`)
        res
         .status(204)
         .end();
    });

module.exports = bookmarksRouter;