import { callApi } from './util.js';

const TEST_SPEAKERS = [{
    id: 1,
    name: 'George Washington'
}, {
    id: 2,
    name: 'John Adams'
}, {
    id: 3,
    name: 'Thomas Jefferson'
}, {
    id: 4,
    name: 'James Madison'
}, {
    id: 5,
    name: 'James Monroe'
}, {
    id: 6,
    name: 'John Quincy Adams'
}, {
    id: 7,
    name: 'Andrew Jackson'
}, {
    id: 8,
    name: 'Martin Van Buren'
}, {
    id: 9,
    name: 'William Henry Harrison'
}, {
    id: 10,
    name: 'John Tyler'
}];

const TOTAL_DOCUMENTS = 943;
let nextId = TOTAL_DOCUMENTS + 1;

function createTestDocSummary(index) {
    return {
        id: index,
        title: `First Inaugural Address (${index + 1})`,
        date: '03/30/1789',
        speakerName: 'George Washington'
    };
}

function createNewTestDocSummary(documentId, data) {

    const speakerId = data.speakerId;
    let speakerName = '';
    for (const speaker of TEST_SPEAKERS) {
        if (speaker.id === speakerId) {
            speakerName = speaker.name;
        }
    }

    return {
        id: documentId !== null ? documentId : nextId++,
        title: data.title,
        date: data.date,
        speakerId,
        speakerName
    };
}

function createTestDocDetail(id) {

    const speakerId = 1;
    let speakerName = '';
    for (const speaker of TEST_SPEAKERS) {
        if (speaker.id === speakerId) {
            speakerName = speaker.name;
        }
    }

    return {
        id: id || nextId++,
        title: 'First Inaugural Address',
        date: '03/30/1789',
        speakerId,
        speakerName,
        speakerTerm: '0',
        textContent: 'Fellow Citizens of the Senate and the House of Representatives.\nAmong the vicissitudes incident to life, no event could have filled me with greater anxieties than that of which the notification was transmitted by your order, and received on the fourteenth day of the present month. On the one hand, I was summoned by my Country, whose voice I can never hear but with veneration and love, from a retreat which I had chosen with the fondest predilection, and, in my flattering hopes, with an immutable decision, as the asylum of my declining years: a retreat which was rendered every day more necessary as well as more dear to me, by the addition of habit to inclination, and of frequent interruptions in my health to the gradual waste committed on it by time. On the other hand, the magnitude and difficulty of the trust to which the voice of my Country called me, being sufficient to awaken in the wisest and most experienced of her citizens, a distrustful scrutiny into his qualifications, could not but overwhelm with dispondence, one, who, inheriting inferior endowments from nature and unpractised in the duties of civil administration, ought to be peculiarly conscious of his own deficiencies. In this conflict of emotions, all I dare aver, is, that it has been my faithful study to collect my duty from a just appreciation of eve ry circumstance, by which it might be affected. All I dare hope, is, that, if in executing this task I have been too much swayed by a grateful remembrance of former instances, or by an affectionate sensibility to this transcendent proof, of the confidence of my fellow-citizens; and have thence too little consulted my incapacity as well as disinclination for the weighty and untried cares before me; my error will be palliated by the motives which misled me, and its consequences be judged by my Country, with some share of the partiality in which they originated.\nSuch being the impressions under which I have, in obedience to the public summons, repaired to the present station; it would be peculiarly improper to omit in this first official Act, my fervent supplications to that Almighty Being who rules over the Universe, who presides in the Councils of Nations, and whose providential aids can supply every human defect, that his benediction may consecrate to the liberties and happiness of the People of the United States, a Government instituted by themselves for these essential purposes: and may enable every instrument employed in its administration to execute with success, the functions allotted to his charge. In tendering this homage to the Great Author of every public and private good I assure myself that it expresses your sentiments not less than my own; nor those of my fellow-citizens at large, less than either. No People can be bound to acknowledge and adore the invisible hand, which conducts the Affairs of men more than the People of the United States. Every step, by which they have advanced to the character of an independent nation, seems to have been distinguished by some token of providential agency. And in the important revolution just accomplished in the system of their United Government, the tranquil deliberations and voluntary consent of so many distinct communities, from which the event has resulted, cannot be compared with the means by which most Governments have been established, without some return of pious gratitude along with an humble anticipation of the future blessings which the past seem to presage. These reflections, arising out of the present crisis, have forced themselves too strongly on my mind to be suppressed. You will join with me I trust in thinking, that there are none under the influence of which, the proceedings of a new and free Government can more auspiciously commence.\nBy the article establishing the Executive Department, it is made the duty of the President "to recommend to your consideration, such measures as he shall judge necessary and expedient." The circumstances under which I now meet you, will acquit me from entering into that subject, farther than to refer to the Great Constitutional Charter under which you are assembled; and which, in defining your powers, designates the objects to which your attention is to be given. It will be more consistent with those circumstances, and far more congenial with the feelings which actuate me, to substitute, in place of a recommendation of particular measures, the tribute that is due to the talents, the rectitude, and the patriotism which adorn the characters selected to devise and adopt them. In these honorable qualifications, I behold the surest pledges, that as on one side, no local prejudices, or attachments; no seperate views, nor party animosities, will misdirect the comprehensive and equal eye which ought to watch over this great assemblage of communities and interests: so, on another, that the foundations of our National policy will be laid in the pure and immutable principles of private morality; and the pre-eminence of a free Government, be exemplified by all the attributes which can win the affections of its Citizens, and command the respect of the world.\nI dwell on this prospect with every satisfaction which an ardent love for my Country can inspire: since there is no truth more thoroughly established, than that there exists in the economy and course of nature, an indissoluble union between virtue and happiness, between duty and advantage, between the genuine maxims of an honest and magnanimous policy, and the solid rewards of public prosperity and felicity: Since we ought to be no less persuaded that the propitious smiles of Heaven, can never be expected on a nation that disregards the eternal rules of order and right, which Heaven itself has ordained: And since the preservation of the sacred fire of liberty, and the destiny of the Republican model of Government, are justly considered as deeply, perhaps as finally staked, on the experiment entrusted to the hands of the American people.\nBesides the ordinary objects submitted to your care, it will remain with your judgment to decide, how far an exercise of the occasional power delegated by the Fifth article of the Constitution is rendered expedient at the present juncture by the nature of objections which have been urged against the System, or by the degree of inquietude which has given birth to them. Instead of undertaking particular recommendations on this subject, in which I could be guided by no lights derived from official opportunities, I shall again give way to my entire confidence in your discernment and pursuit of the public good: For I assure myself that whilst you carefully avoid every alteration which might endanger the benefits of an United and effective Government, or which ought to await the future lessons of experience; a reverence for the characteristic rights of freemen, and a regard for the public harmony, will sufficiently influence your deliberations on the question how far the former can be more impregnably fortified, or the latter be safely and advantageously promoted.\nTo the preceeding observations I have one to add, which will be most properly addressed to the House of Representatives. It concerns myself, and will therefore be as brief as possible. When I was first honoured with a call into the Service of my Country, then on the eve of an arduous struggle for its liberties, the light in which I contemplated my duty required that I should renounce every pecuniary compensation. From this resolution I have in no instance departed. And being still under the impressions which produced it, I must decline as inapplicable to myself, any share in the personal emoluments, which may be indispensably included in a permanent provision for the Executive Department; and must accordingly pray that the pecuniary estimates for the Station in which I am placed, may, during my continuance in it, be limited to such actual expenditures as the public good may be thought to require.\nHaving thus imported to you my sentiments, as they have been awakened by the occasion which brings us together, I shall take my present leave; but not without resorting once more to the benign parent of the human race, in humble supplication that since he has been pleased to favour the American people, with opportunities for deliberating in perfect tranquility, and dispositions for deciding with unparellelled unanimity on a form of Government, for the security of their Union, and the advancement of their happiness; so his divine blessing may be equally conspicuous in the enlarged views, the temperate consultations, and the wise measures on which the success of this Government must depend.'
    };
}

export const createDocument = (data) => callApi('documents', 'POST', data, () => {
    return Promise.resolve(createNewTestDocSummary(null, data));
});
export const getDocuments = () => callApi(`documents`, 'GET', null, () => {
    const documents = [];
    for (let i = 0; i < TOTAL_DOCUMENTS; i++) {
        documents.push(createTestDocSummary(i));
    }
    return Promise.resolve(documents);
});
export const getDocument = (documentId) => callApi(`documents/${documentId}`, 'GET', null, () => {
    return Promise.resolve(createTestDocDetail(documentId));
});
export const updateDocument = (documentId, data) => callApi(`documents/${documentId}`, 'PUT', data, () => {
    return Promise.resolve(createNewTestDocSummary(documentId, data));
});
export const deleteDocument = (documentId) => callApi(`documents/${documentId}`, 'DELETE', null, () => {
    return Promise.resolve();
});
