define(['backbone', 'gettext', 'underscore'], function(Backbone, gettext, _) {
    /**
     * Model for xblock validation messages as displayed in Studio.
     */
    var XBlockValidationModel = Backbone.Model.extend({
        defaults: {
            summary: {},
            messages: [],
            empty: true,
            xblock_id: null,
            isUnit: false
        },

        WARNING: 'warning',
        ERROR: 'error',
        NOT_CONFIGURED: 'not-configured',

        parse: function(response) {
            var validationMessages = response.validationMessages;
            if (!validationMessages.empty) {
                var summary = 'summary' in validationMessages ? validationMessages.summary : {};
                var messages = 'messages' in validationMessages ? validationMessages.messages : [];
                if (!summary.text) {
                    if (response.isUnit) {
                        summary.text = gettext('This unit has validation issues.');
                    } else {
                        summary.text = gettext('This component has validation issues.');
                    }
                }
                if (!summary.type) {
                    summary.type = this.WARNING;
                    // Possible types are ERROR, WARNING, and NOT_CONFIGURED. NOT_CONFIGURED is treated as a warning.
                    _.find(messages, function(message) {
                        if (message.type === this.ERROR) {
                            summary.type = this.ERROR;
                            return true;
                        }
                        return false;
                    }, this);
                }
                validationMessages.summary = summary;
                if (validationMessages.showSummaryOnly) {
                    messages = [];
                }
                validationMessages.messages = messages;
            }

            return validationMessages;
        }
    });
    return XBlockValidationModel;
});
