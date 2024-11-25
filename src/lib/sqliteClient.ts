

export async function getStatus(event) {
    const res = event.locals.db.prepare("select value_int from meta where key='status'").get();
    return res.value_int;
}


export async function updateStatus(event, newStatus: number) {
    event.locals.db.prepare("update meta set value_int = ? where key='status'").run(newStatus);
}

export async function getSuspects(event, all: boolean) {
    let res;
    const query = "select rowid as id, * from suspects" + (all ? " order by is_playing desc, real_name asc" : " where is_playing=1 order by name");
    res = event.locals.db.prepare(query).all();
    return res;
}
export async function getSuspect(event, id: number) {
    return event.locals.db.prepare("select rowid as id, * from suspects where rowid=?").get(id);
}

export async function updateSuspectName(event, id: number, name: string) {
    event.locals.db.prepare("update suspects set name = ? where rowid=?").run(name, id);
}

export async function switchSuspectIsPlaying(event, id: number) {
    event.locals.db.prepare("update suspects set is_playing = not is_playing where rowid=?").run(id);
}

export async function updateSuspectPicture(event, id: number, pictureData: string) {
    event.locals.db.prepare("update suspects set picture_data = ? where rowid=?").run(pictureData, id);
}

export async function deleteSuspect(event, id: number) {
    console.log(id);
    event.locals.db.prepare("delete from suspects where rowid=?").run(id);
}

export async function createSuspect(event, name: string) {
    event.locals.db.prepare("insert into suspects(name) values(?)").run(name);
}

export async function voteForSuspect(event, id: number) {
    event.locals.db.prepare("update suspects set votes = votes+1 where rowid=?").run(id);
}

export async function resetVotesForSuspects(event) {
    event.locals.db.prepare("update suspects set votes = 0").run();
}
