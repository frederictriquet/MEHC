

export async function getStatus(event) {
    const res = event.locals.db.prepare("select value_int from meta where key='status'").get();
    return res.value_int;
}