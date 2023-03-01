function extractLinks(arrLinks) {
    return arrLinks.map((linkObject) => Object.values(linkObject).join());
}

function errorHandler(err) {
    if (err.cause.code === 'ENOTFOUND') {
        return 'link not found';
    } else {
        return 'an error occurred';
    }
}

async function checkStatus(listURLs) {
    const arrStatus = await Promise
        .all(
            listURLs.map(async (url) => {
                try {
                    const response = await fetch(url);
                    return `${response.status} - ${response.statusText}`;
                } catch (err) {
                    return errorHandler(err);
                }
            })
        );

    return arrStatus;
}

export default async function validatedList(linksList) {
    const links = extractLinks(linksList);
    const status = await checkStatus(links);

    return linksList.map((object, index) => ({
        ...object,
        status: status[index]
    }));
}