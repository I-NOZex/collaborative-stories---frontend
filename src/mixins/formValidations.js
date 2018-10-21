export default {
    methods: {
        validEmail: function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },        
        validateForm: function (model) {
            model.isValid = true;

            Object.keys(model.fields).forEach(key => {
                const field = model.fields[key];
                const rules = field.validationRules;

                field.isValid = true;
                field.errorMsg = '';

                rules.forEach(rule => { //FIXME: Consider use `lodash` or other function that allows to skip a iteration cycle

                    if (field.isValid && rule === 'required') {
                        if (field.value.length < 1) {
                            field.errorMsg = `${field.placeholder} is required.`;
                            field.isValid = false;
                            model.isValid = false;
                        }

                    } else if (field.isValid && rule === 'email') {
                        if (!this.validEmail(field.value)) {
                            field.errorMsg = `${field.placeholder} is not valid.`;
                            field.isValid = false;
                            model.isValid = false;
                        }

                    } else if (field.isValid && rule.startsWith('=')) {
                        const comparationFieldName = rule.substring(1);

                        if (model.fields.hasOwnProperty(comparationFieldName)) {
                            const comparationField = model.fields[comparationFieldName];
                            if (field.value !== comparationField.value) {
                                field.errorMsg = `${field.placeholder} must be equal to ${comparationField.placeholder}.`;
                                field.isValid = false;
                                model.isValid = false;
                            }
                        } else {
                            console.error(`"${rule}" is invalid.`)
                        }
                    }

                });
            });
            return model.isValid;
        },        
    }
}