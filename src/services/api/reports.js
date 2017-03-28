export const ReportType = {
    Scorecard: 0/*,
    WorldCloud: 1,
    Distinct: 2,
    Unique: 3,
    Top10: 4,
    PartOfSpeech: 5,
    Sentiment: 6*/
};

const scorecardResponse = {
    scorecard:
    {
        sentiment:
        {
            collection1: 47.7,
            collection2: 39.7
        },
        pos:
        {
            collection1:
            {
                adj: 28,
                adv: 1,
                noun: 31,
                pronoun: 31,
                verb: 8,
                determiner: 1
            },
            collection2:
            {
                adj: 24,
                adv: 16,
                noun: 60,
                pronoun: 0,
                verb: 0,
                determiner: 0
            }
        },
        num_sent_total:
        {
            collection1: 167,
            collection2: 199
        },
        num_sent_avg:
        {
            collection1: 54,
            collection2: 186
        },
        num_word_total:
        {
            collection1: 334,
            collection2: 1475
        },
        num_word_avg:
        {
            collection1: 1781,
            collection2: 753
        },
        cardinality:
        {
            collection1: 243,
            collection2: 107
        }
    }
};

export const createReport = (data) => callApi('reports', 'POST', data, () => {
    return Promise.resolve(scorecardResponse);
});
