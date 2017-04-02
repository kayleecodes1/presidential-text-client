export const ReportType = {
    Scorecard: 'scorecard'/*,
    WorldCloud: 1,
    Distinct: 2,
    Unique: 3,
    Top10: 4,
    PartOfSpeech: 5,
    Sentiment: 6*/
};

export const createReport = (data) => callApi('reports', 'POST', data, (report) => {
    return report;
});
