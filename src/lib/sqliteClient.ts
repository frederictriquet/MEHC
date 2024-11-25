

export async function getStatus(event) {
    const res = event.locals.db.prepare("select value_int from meta where key='status'").get();
    return res.value_int;
}


export async function updateStatus(event, newStatus: number) {
    event.locals.db.prepare("update meta set value_int = ? where key='status'").run(newStatus);
}

export async function getSuspects(event, all: boolean) {
    let res;
    if (all)
        res = event.locals.db.prepare("select * from suspects").get();
    else
        res = event.locals.db.prepare("select * from suspects where is_playing=1").get();
    return res;
}
export async function getSuspect(event, id: number) {
    return event.locals.db.prepare("select * from suspects where rowid=?").get(id);
}

export async function updateSuspectName(event, id: number, name: string) {
    event.locals.db.prepare("update suspects set name = ? where id=?").run(name, id);
}

export async function updateSuspectPicture(event, id: number, pictureData: string) {
    event.locals.db.prepare("update suspects set picture_data = ? where id=?").run(pictureData, id);
}

export async function deleteSuspect(event, id: number) {
    event.locals.db.prepare("delete suspects where id=?").run(id);
}

export async function createSuspect(event, name: string) {
    event.locals.db.prepare("insert into suspects(name) values(?)").run(name);
}

export async function voteForSuspect(event, id: number) {
    event.locals.db.prepare("update suspects set votes = votes+1 where id=?").run(id);
}

export async function resetVotesForSuspects(event) {
    event.locals.db.prepare("update suspects set votes = 0").run();
}
