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



const _ = require('lodash');
const { parse, isValid } = require('date-fns');

const CLASS = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve"
]


/**
 * Validates name for minimum and maximum length constraints.
 * @param {string} fullName - The name to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const isNameValid = (fullName) => {
    const MINIMUM_LENGTH = 3;
    const MAXIMUM_LENGTH = 100;

    if (fullName.length < MINIMUM_LENGTH) {
        return 'input_data_must_be_at_least_3_characters';
    }
    if (fullName.length > MAXIMUM_LENGTH) {
        return 'name_must_not_exceed_100_characters';
    }
    return true;
}

/**
 * Validates an password address format.
 * @param {string} password - The password to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const isPasswordValid = (password) => {
    const MINIMUM_LENGTH = 3;
    const MAXIMUM_LENGTH = 150;

    if (password.length < MINIMUM_LENGTH) {
        return 'input_data_must_be_at_least_3_characters';
    }
    if (password.length > MAXIMUM_LENGTH) {
        return 'password_must_not_exceed_150_characters';
    }
    return true;
}


/**
 * Validates an email address format.
 * @param {string} email - The email to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'invalid_email_address';
    }
    return true;
};


/**
 * Validates employee classList against allowed values.
 * @param {string} classList - The classList to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const isValidClass = (classList) => {
    if (!CLASS.includes(classList)) {
        return 'invalid_department';
    }
    return true;
};


/**
 * Validates a description for maximum length.
 * @param {string} description - The description to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const isDescriptionValid = (description) => {
    const MAXIMUM_LENGTH = 500;
    if (description.length > 0) {
        if (description.length > MAXIMUM_LENGTH) {
            return 'description_must_not_exceed_500_characters';
        }
    }
    return true;
}

/**
 * Validates a project start date for correct format (yyyy-MM-dd).
 * @param {string} startDate - The date string to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const isValidProjectDate = (startDate) => {
    const parsed = parse(startDate, 'yyyy-MM-dd', new Date());
    const isValidDate = isValid(parsed);
    if (!isValidDate) {
        return 'invalid_date_format';
    }
    return true;
}


/**
 * Validates a phone number for length constraints.
 * @param {string} phoneNumber - The phone number to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const isPhoneNumberValid = (phoneNumber) => {
    const MINIMUM_LENGTH = 10;
    const MAXIMUM_LENGTH = 15;
    if (phoneNumber.length < MINIMUM_LENGTH
        || phoneNumber.length > MAXIMUM_LENGTH) {
        return 'invalid_user_phone_number';
    }
    return true;
};

/**
 * Validates an address for type and maximum length.
 * @param {string} address - The address to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const isAddressValid = (address) => {
    const MAXIMUM_LENGTH = 200;
    if (address.length > MAXIMUM_LENGTH) {
        return 'address_must_not_exceed_200_characters';
    }
    if (typeof address !== 'string') {
        return 'address_must_be_a_string';
    }
    return true;
};

/**
 * Validates an monthly_fees for type and maximum length.
 * @param {string} monthly_fees - The monthly_fees to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const isMonthlyFeesValid = (monthly_fees) => {
    if (typeof monthly_fees !== 'number') {
        return 'input_value_must_be_a_number';
    }
    return true;
};


/**
 * Validates message for minimum and maximum length constraints.
 * @param {string} message - The message to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const isMessageValid = (message) => {
    const MINIMUM_LENGTH = 3;
    const MAXIMUM_LENGTH = 300;

    if (message.length < MINIMUM_LENGTH) {
        return 'input_data_must_be_at_least_3_characters';
    }
    if (message.length > MAXIMUM_LENGTH) {
        return 'input_data_must_not_exceed_300_characters';
    }
    return true;
}


module.exports = {
    isNameValid,
    isEmailValid,
    isValidClass,
    isMonthlyFeesValid,
    isPasswordValid,
    isValidProjectDate,
    isDescriptionValid,
    isPhoneNumberValid,
    isAddressValid,
    isMessageValid
};