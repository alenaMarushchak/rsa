var Input = function () {
    this.read = function (inputId) {
        var result = $('#' + inputId).val();

        return result;
    };

    this.readFromHtml = function (tagId) {
        return $('#' + tagId).html();
    };

    this.write = function (inputId, value) {
        $('#' + inputId).html(value);
    };
};