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
const { parse, isValid, getYear } = require('date-fns');

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
];

const PLAN = [
    "TRAIL",
    "PAID"
]

const monthArray = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

const PAYMENT_STATUS = [
    "PAID",
    "DUE"
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
 * Validates name for minimum and maximum length constraints.
 * @param {string} coachingName - The name to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const isCoachingNameValid = (coachingName) => {
    const MINIMUM_LENGTH = 3;
    const MAXIMUM_LENGTH = 150;

    if (coachingName.length < MINIMUM_LENGTH) {
        return 'input_data_must_be_at_least_3_characters';
    }
    if (coachingName.length > MAXIMUM_LENGTH) {
        return 'coaching_name_must_not_exceed_150_characters';
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
        return 'invalid_class';
    }
    return true;
};

/**
 * Validates an classes address format.
 * @param {string} classes - The classes to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const isClassStringValid = (classes) => {
    const MINIMUM_LENGTH = 3;
    const MAXIMUM_LENGTH = 150;

    if (!Array.isArray(classes)) {
        return "class_must_be_an_array";
    }

    for (const cls of classes) {
        if (typeof cls !== "string") {
            return "class_must_be_string";
        }

        if (cls.length > MAXIMUM_LENGTH) {
            return "class_must_not_exceed_150_characters";
        }
    }

    return true;
};

/**
 * Validates employee plan against allowed values.
 * @param {string} plan - The plan to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const isPlanValid = (plan) => {
    if (!PLAN.includes(plan)) {
        return 'invalid_plan';
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

/**
 * Validates month for allowed values.
 * @param {string} month 
 * @returns {true|string} True if valid, error string otherwise.
 */
const isMonthValid = (month) => {
    if (!monthArray.includes(month)) {
        return 'month_is_invalid';
    }
    return true;
};

/**
 * Validates year for allowed values.
 * @param {string} year 
 * @returns {true|string} True if valid, error string otherwise.
 */
const isYearValid = (year) => {
    const yearString = typeof year === 'number' ? String(year) : year;
    if (typeof yearString !== 'string' || !/^[0-9]{4}$/.test(yearString)) {
        return 'year_is_invalid';
    }

    const parsedYear = parse(yearString, 'yyyy', new Date());
    if (!isValid(parsedYear) || getYear(parsedYear) !== Number(yearString)) {
        return 'year_is_invalid';
    }

    return true;
};

/**
 * Validates month for allowed values.
 * @param {string} status 
 * @returns {true|string} True if valid, error string otherwise.
 */
const isPaymentStatusValid = (status) => {
    if (!PAYMENT_STATUS.includes(status)) {
        return 'payment_status_is_invalid';
    }
    return true;
};


module.exports = {
    isNameValid,
    isCoachingNameValid,
    isEmailValid,
    isValidClass,
    isMonthlyFeesValid,
    isPlanValid,
    isPasswordValid,
    isValidProjectDate,
    isDescriptionValid,
    isPhoneNumberValid,
    isAddressValid,
    isMessageValid,
    isClassStringValid,
    isMonthValid,
    isYearValid,
    isPaymentStatusValid
};