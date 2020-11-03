const mostAbundantStrategy = require('./mostAbundant');
const closestLocationStrategy = require('./closestLocation');

exports.getStrategy = (strategyName) => {
    switch(strategyName) {
        case "mostAbundant":
            return mostAbundantStrategy.run;
        case "closestLocation":
            return closestLocationStrategy.run;
        default:
            return mostAbundantStrategy.run;

    }
}