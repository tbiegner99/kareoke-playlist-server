const assertThatObjectMatchesModel = async (object, model) => {
    await model.validateAsync(object);
};

module.exports = { assertThatObjectMatchesModel };
