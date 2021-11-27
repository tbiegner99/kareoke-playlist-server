const fromGetReadingsRequest = req => {
    const { zone, type, filter } = req.params;
    const { startDate, endDate } = req.query;
    return { zone, type, filter, startDate, endDate };
};

const fromCreateReadingRequest = req => {
    const { zone, type } = req.params;
    const { temperature, humidity } = req.body;
    return { zone, type, temperature, humidity };
};

const fromCreateZoneRequest = req => {
    const { name, description } = req.body;
    return { name, description };
};

const toReadingResponse = reading => ({
    id: reading.id,
    type: reading.type,
    date: reading.date,
    zone: reading.zone,
    temperature: reading.temperature,
    humidity: reading.humidity,
});

const toGetReadingsResponse = readings => readings.map(toReadingResponse);

const toZoneResponse = zone => ({
    name: zone.name,
    description: zone.description,
    dateAdded: zone.dateAdded,
});

const toZonesResponse = zones => zones.map(toZoneResponse);

module.exports = {
    toZoneResponse,
    toZonesResponse,
    toGetReadingsResponse,
    toReadingResponse,
    fromGetReadingsRequest,
    fromCreateZoneRequest,
    fromCreateReadingRequest,
};
