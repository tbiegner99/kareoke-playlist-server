const SELECT_READINGS_BASE = `Select r.id, r.zone,r.date, t.temperature,h.humidity
    from reading r
    LEFT JOIN temperature_reading t on t.reading_id=r.id
    LEFT JOIN humidity_reading h on h.reading_id=r.id
    where r.zone=:zone AND type=:type`;

const SELECT_READINGS_WITHIN_DAY = `${SELECT_READINGS_BASE} AND date >= NOW() - INTERVAL 1 DAY`;
const SELECT_READINGS_WITHIN_WEEK = `${SELECT_READINGS_BASE} AND date >= NOW() - INTERVAL 1 WEEK`;
const SELECT_READINGS_WITHIN_MONTH = `${SELECT_READINGS_BASE} AND date >= NOW() - INTERVAL 1 MONTH`;
const SELECT_READINGS_WITHIN_YEAR = `${SELECT_READINGS_BASE} AND date >= NOW() - INTERVAL 1 YEAR`;
const SELECT_READINGS_WITHIN_CUSTOM_RANGE = `${SELECT_READINGS_BASE} AND date >= :startDate AND date<= :endDate`;

const CREATE_ZONE =
    'INSERT IGNORE INTO reading_zones (zone,description,date_added) VALUES (:name, :description, :date)';
const GET_ZONES = 'SELECT * from reading_zones';
const ADD_BASE_READING =
    'INSERT INTO reading (zone,type,date) VALUES (:zone, :type,:date)';
const INSERT_TERMPERATURE_READING =
    'INSERT INTO temperature_reading (reading_id,temperature) VALUES (:readingId,:temperature)';
const INSERT_HUMIDITY_READING =
    'INSERT INTO humidity_reading (reading_id,humidity) VALUES (:readingId,:humidity)';
module.exports = {
    SELECT_READINGS_WITHIN_CUSTOM_RANGE,
    SELECT_READINGS_WITHIN_DAY,
    SELECT_READINGS_WITHIN_MONTH,
    SELECT_READINGS_WITHIN_WEEK,
    SELECT_READINGS_WITHIN_YEAR,
    GET_ZONES,
    CREATE_ZONE,
    ADD_BASE_READING,
    INSERT_HUMIDITY_READING,
    INSERT_TERMPERATURE_READING,
};
