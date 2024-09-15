export function GET({ params }) { // note the capitalized method name
    const { city } = params;

    // we can now simply pass on the original 3rd-party api response promise
    return fetch(`https://www.metaweather.com/api/location/search/?query=${city}`);
}