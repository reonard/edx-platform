define(['js/views/xblock_validation', 'js/models/xblock_validation'],
function(XBlockValidationView, XBlockValidationModel) {
    'use strict';
    return function(validationMessages, hasEditingUrl, isRoot, isUnit, validationEle) {
        if (hasEditingUrl && !isRoot) {
            validationMessages.showSummaryOnly = true;
        }

        var model = new XBlockValidationModel({validationMessages: validationMessages, isUnit: isUnit}, {parse: true});

        if (!model.get('empty')) {
            new XBlockValidationView({el: validationEle, model: model, root: isRoot}).render();
        }
    };
});
