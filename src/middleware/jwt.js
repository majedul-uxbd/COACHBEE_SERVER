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


const jwt = require('jsonwebtoken');
const { pool } = require('../DB/db-pool');
const { setServerResponse } = require('../common/set-server-response');
const { API_STATUS_CODE } = require('../consts/error-status');
const { TABLES } = require('../DB/database-information/tables');
const { TABLE_USERS_COLUMNS_NAME } = require('../DB/database-information/table-user-columns-name');

/**
 * Checks if a user with the given parameters is present and active in the database.
 * @param {number} id - The user's ID.
 * @param {string} email - The user's email address.
 * @param {boolean} role - The user's admin status.
 * @returns {Promise<boolean>} - Resolves to true if user exists and is active, false otherwise. Returns error on failure.
 */
const checkUserId = async (id, uuid, email, role) => {
	const query = `
  	SELECT
		*
	FROM
		${TABLES.TBL_USERS}
	WHERE
		${TABLE_USERS_COLUMNS_NAME.ID} = ? AND
		${TABLE_USERS_COLUMNS_NAME.UUID} = ? AND
		${TABLE_USERS_COLUMNS_NAME.EMAIL} = ? AND
		${TABLE_USERS_COLUMNS_NAME.ROLE}  = ? AND
		${TABLE_USERS_COLUMNS_NAME.IS_ACTIVE}  = ${1};
  	`;

	const values = [
		id,
		uuid,
		email,
		role
	]

	try {
		const [result] = await pool.query(query, values);
		if (result.length > 0) {
			return true;
		}
		return false;
	} catch (error) {
		return error
	}

};


/**
 * Middleware to verify user JWT token and authenticate user.
 * Checks for valid token, verifies it, and attaches user info to request if valid.
 * @returns {void}
 * @description This function verifies the JWT token, checks user existence, and authenticates the request.
 */
const authenticateToken = async (req, res, next) => {
	const token = req.header('Authorization');

	if (!token) return res.status(400).send(
		setServerResponse(
			API_STATUS_CODE.BAD_REQUEST,
			'authorization_token_is_missing',
			'en',
			null
		)
	);
	let authToken = token.split(' ');

	if (authToken[1] === 'undefined' || authToken[1] === 'null') {
		return res.status(400).send(
			setServerResponse(
				API_STATUS_CODE.BAD_REQUEST,
				'invalid_authorization_token',
				'en',
				null
			)
		);
	}

	jwt.verify(authToken[1], process.env.SECRET_KEY, async (err, user) => {
		if (err) {
			return res.status(400).send(
				setServerResponse(
					API_STATUS_CODE.BAD_REQUEST,
					'invalid_authorization_token',
					'en',
					null
				)
			);
		}
		const { id, uuid, email, role } = user;
		try {
			const isUserExist = await checkUserId(id, uuid, email, role);
			if (isUserExist === true) {
				req.auth = {
					id,
					uuid,
					email,
					role
				};
				next();
			} else {
				return res.status(400).send(
					setServerResponse(
						API_STATUS_CODE.UNAUTHORIZED,
						'invalid_user',
						'en',
						null
					)
				);
			}
		} catch (error) {
			return res.status(400).send(
				setServerResponse(
					API_STATUS_CODE.UNAUTHORIZED,
					'invalid_user',
					'en',
					null
				)
			);
		}
	});
};

module.exports = {
	authenticateToken
};
