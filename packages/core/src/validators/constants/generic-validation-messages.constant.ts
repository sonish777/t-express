export const ValidationMessages = {
    required: '%field% is a required field',
    email: '%field% is not a valid email address',
    min: '%field% must be at least %min% characters',
    max: '%field% cannot exceed %max% characters',
    date: '%field% is not a valid date',
    confirmPassword: 'Passwords do not match',
    shouldContain: '%field% should contain either of %options%',
} as const;
