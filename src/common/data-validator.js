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

const DEPARTMENT = [
    'sales',
    'finance',
    'engineer'
]

/**
 * Validates a employee ID for minimum and maximum length constraints.
 * @param {string} employeeId - The employee ID to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const isEmployeeIDValid = (employeeId) => {
    const MINIMUM_LENGTH = 3;
    const MAXIMUM_LENGTH = 45;
    if (typeof employeeId !== 'string') {
        return 'employee_id_must_be_a_string';
    }
    if (employeeId.length < MINIMUM_LENGTH) {
        return 'employee_id_must_be_at_least_3_characters';
    }
    if (employeeId.length > MAXIMUM_LENGTH) {
        return 'employee_id_must_not_exceed_45_characters';
    }
    return true;
}


/**
 * Validates a employee name for minimum and maximum length constraints.
 * @param {string} fullName - The employee name to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const isEmployeeNameValid = (fullName) => {
    const MINIMUM_LENGTH = 3;
    const MAXIMUM_LENGTH = 150;

    if (fullName.length < MINIMUM_LENGTH) {
        return 'employee_name_must_be_at_least_3_characters';
    }
    if (fullName.length > MAXIMUM_LENGTH) {
        return 'employee_name_must_not_exceed_150_characters';
    }
    return true;
}

/**
 * Validates a client name for minimum and maximum length constraints.
 * @param {string} clientName - The client name to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const isClientNameValid = (clientName) => {
    const MINIMUM_LENGTH = 3;
    const MAXIMUM_LENGTH = 150;

    if (clientName.length < MINIMUM_LENGTH) {
        return 'client_name_must_be_at_least_3_characters';
    }
    if (clientName.length > MAXIMUM_LENGTH) {
        return 'client_name_must_not_exceed_150_characters';
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
 * Validates employee department against allowed values.
 * @param {string} department - The department to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const isValidDepartment = (department) => {
    if (!DEPARTMENT.includes(department)) {
        return 'invalid_department';
    }
    return true;
};


/**
 * Validates a project name for allowed characters and length constraints.
 * @param {string} projectName - The project name to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const isProjectNameValid = (projectName) => {
    const MINIMUM_LENGTH = 3;
    const MAXIMUM_LENGTH = 150;
    const stringRegex = /^[a-zA-Z0-9\s]+$/;

    if (!stringRegex.test(projectName)) {
        return 'project_name_can_only_contain_alphanumeric_characters_and_spaces';
    }
    if (projectName.length < MINIMUM_LENGTH) {
        return 'project_name_must_be_at_least_3_characters';
    }
    if (projectName.length > MAXIMUM_LENGTH) {
        return 'project_name_must_not_exceed_100_characters';
    }
    return true;
}

/**
 * Validates a project description for maximum length.
 * @param {string} projectDescription - The description to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const isProjectDescriptionValid = (projectDescription) => {
    const MAXIMUM_LENGTH = 500;
    if (projectDescription.length > 0) {
        if (projectDescription.length > MAXIMUM_LENGTH) {
            return 'project_description_must_not_exceed_500_characters';
        }
    }
    return true;
}

/**
 * Validates a project version for maximum length.
 * @param {string} projectVersion - The version to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const isProjectVersionValid = (projectVersion) => {
    const MAXIMUM_LENGTH = 45;
    if (projectVersion.length > 0) {
        if (projectVersion.length > MAXIMUM_LENGTH) {
            return 'project_version_must_not_exceed_45_characters';
        }
    }
    return true;
}

/**
 * Validates a generic string for type and maximum length.
 * @param {string} deviceData - The string to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const requiredDeviceDataValid = (deviceData) => {
    const MAXIMUM_LENGTH = 300;
    if (deviceData.length > MAXIMUM_LENGTH) {
        return 'value_must_not_exceed_300_characters';
    }
    if (typeof deviceData !== 'string') {
        return 'string_data_is_required';
    }
    return true;
}

/**
 * Validates a generic string for type and maximum length.
 * @param {string} budgetData - The string to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const requiredDeviceBudgetDataValid = (budgetData) => {
    const MAXIMUM_LENGTH = 300;
    if (budgetData.length > MAXIMUM_LENGTH) {
        return 'value_must_not_exceed_300_characters';
    }
    if (typeof budgetData !== 'string') {
        return 'string_data_is_required';
    }
    return true;
}

/**
 * Validates a generic string for type and maximum length.
 * @param {string} memberData - The string to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const requiredMemberDataValid = (memberData) => {
    const MAXIMUM_LENGTH = 300;
    if (memberData.length > MAXIMUM_LENGTH) {
        return 'value_must_not_exceed_300_characters';
    }
    if (typeof memberData !== 'string') {
        return 'string_data_is_required';
    }
    return true;
}

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
 * Validates a generic input for maximum length (500 chars).
 * @param {string} description - The input to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const commonStringDataValid2 = (description) => {
    const MAXIMUM_LENGTH = 500;
    if (description.length > 0) {
        if (description.length > MAXIMUM_LENGTH) {
            return 'input_must_not_exceed_500_characters';
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
 * Validates a task priority against allowed values.
 * @param {string} priority - The priority to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const isValidTaskPriority = (priority) => {
    if (!TASK_PRIORITY.includes(priority)) {
        return 'invalid_task_priority';
    }
    return true;
};

/**
 * Validates a task module against allowed values.
 * @param {string} module - The module to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const isValidTaskModule = (module) => {
    if (!TASK_MODULE.includes(module)) {
        return 'invalid_task_module';
    }
    return true;
};

/**
 * Validates a test status against allowed values.
 * @param {string} priority - The test status to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const isValidTestStatus = (priority) => {
    if (!TEST_STATUS.includes(priority)) {
        return 'invalid_test_status';
    }
    return true;
};

/**
 * Validates a test type against allowed values.
 * @param {string} priority - The test type to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const isValidTestType = (priority) => {
    if (!TEST_TYPE.includes(priority)) {
        return 'invalid_testing_type';
    }
    return true;
};

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
 * Validates a project requirements for minimum and maximum length constraints.
 * @param {string} requirements - The project requirements to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const isRequirementsValid = (requirements) => {
    const MINIMUM_LENGTH = 3;
    const MAXIMUM_LENGTH = 300;

    if (requirements.length < MINIMUM_LENGTH) {
        return 'project_requirements_must_be_at_least_3_characters';
    }
    if (requirements.length > MAXIMUM_LENGTH) {
        return 'project_requirements_must_not_exceed_300_characters';
    }
    return true;
}

/**
 * Validates a project license for minimum and maximum length constraints.
 * @param {string} license - The project license to validate.
 * @returns {true|string} True if valid, error string otherwise.
 */
const isLicenseValid = (license) => {
    const MINIMUM_LENGTH = 3;
    const MAXIMUM_LENGTH = 300;

    if (license.length < MINIMUM_LENGTH) {
        return 'project_license_must_be_at_least_3_characters';
    }
    if (license.length > MAXIMUM_LENGTH) {
        return 'project_license_must_not_exceed_300_characters';
    }
    return true;
}

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
    isEmployeeIDValid,
    isEmployeeNameValid,
    isEmailValid,
    isValidDepartment,
    isProjectNameValid,
    isProjectDescriptionValid,
    isProjectVersionValid,
    requiredDeviceDataValid,
    requiredDeviceBudgetDataValid,
    requiredMemberDataValid,
    isValidProjectDate,
    isDescriptionValid,
    isValidTaskPriority,
    commonStringDataValid2,
    isValidTestStatus,
    isValidTestType,
    isValidTaskModule,
    isClientNameValid,
    isPhoneNumberValid,
    isAddressValid,
    isRequirementsValid,
    isLicenseValid,
    isMessageValid
};