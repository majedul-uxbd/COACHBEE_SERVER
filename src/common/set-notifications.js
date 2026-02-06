/**
 * @author Md. Majedul Islam <https://github.com/majedul-uxbd> 
 * Software Engineer,
 * Ultra-X BD Ltd.
 *
 * @copyright All right reserved Ultra-X Asia Pacific
 * 
 * @description 
 * 
 */

const { TABLE_NOTIFICATION_COLUMNS_NAME } = require("../DB/database-information/table-notification-columns-name");
const { TABLES } = require("../DB/database-information/tables");
const { pool } = require("../DB/db-pool");

const insertNotificationQuery = async (title) => {
    const _query = `
    INSERT INTO
        ${TABLES.TBL_NOTIFICATIONS}
        (
            ${TABLE_NOTIFICATION_COLUMNS_NAME.TITLE}
        )
    VALUES(?);
    `;
    try {
        await pool.query(_query, [title]);
    } catch (error) {
        return error;
    }
}

/**
 * Creates and stores a new notification in the database.
 * 
 * Inserts a notification record with the provided title into the notifications table,
 * allowing the system to track and store important events or messages for later retrieval.
 * 
 * @param {string} title - The notification message or title to be stored
 * 
 * @returns {Promise<void>} Resolves when the notification is successfully inserted,
 *                          or returns an error object if insertion fails
 */
const setNotifications = async (title) => {
    try {
        await insertNotificationQuery(title);
    } catch (error) {
        return error
    }
}

module.exports = {
    setNotifications
}