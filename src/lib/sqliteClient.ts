

export async function getStatus(event) {
    try {
        const res = event.locals.db.prepare("select value_int from meta where key='status'").get();
        return res?.value_int ?? 0;
    } catch (error) {
        console.error('Error getting status:', error);
        return 0; // Default to status 0
    }
}


export async function updateStatus(event, newStatus: number) {
    try {
        event.locals.db.prepare("update meta set value_int = ? where key='status'").run(newStatus);
    } catch (error) {
        console.error('Error updating status:', error);
        throw new Error('Failed to update status');
    }
}

export async function getSuspects(event, all: boolean) {
    try {
        const query = "select rowid as id, * from suspects" + (all ? " order by is_playing desc, real_name asc" : " where is_playing=1 order by name");
        const res = event.locals.db.prepare(query).all();
        return res ?? [];
    } catch (error) {
        console.error('Error getting suspects:', error);
        return [];
    }
}

export async function getSuspect(event, id: number) {
    try {
        return event.locals.db.prepare("select rowid as id, * from suspects where rowid=?").get(id);
    } catch (error) {
        console.error('Error getting suspect:', error);
        return null;
    }
}

export async function updateSuspectName(event, id: number, name: string) {
    try {
        event.locals.db.prepare("update suspects set name = ? where rowid=?").run(name, id);
    } catch (error) {
        console.error('Error updating suspect name:', error);
        throw new Error('Failed to update suspect name');
    }
}

export async function switchSuspectIsPlaying(event, id: number) {
    try {
        event.locals.db.prepare("update suspects set is_playing = not is_playing where rowid=?").run(id);
    } catch (error) {
        console.error('Error switching suspect is_playing:', error);
        throw new Error('Failed to toggle suspect status');
    }
}

export async function updateSuspectPicture(event, id: number, pictureData: string) {
    try {
        event.locals.db.prepare("update suspects set picture_data = ? where rowid=?").run(pictureData, id);
    } catch (error) {
        console.error('Error updating suspect picture:', error);
        throw new Error('Failed to update suspect picture');
    }
}

export async function deleteSuspect(event, id: number) {
    try {
        event.locals.db.prepare("delete from suspects where rowid=?").run(id);
    } catch (error) {
        console.error('Error deleting suspect:', error);
        throw new Error('Failed to delete suspect');
    }
}

export async function createSuspect(event, name: string) {
    try {
        event.locals.db.prepare("insert into suspects(real_name, name) values(?, ?)").run(name, name);
    } catch (error) {
        console.error('Error creating suspect:', error);
        throw new Error('Failed to create suspect');
    }
}

export async function voteForSuspect(event, id: number) {
    try {
        // Use transaction to ensure atomic vote counting
        const transaction = event.locals.db.transaction(() => {
            event.locals.db.prepare("update suspects set votes = votes+1 where rowid=?").run(id);
        });
        transaction();
    } catch (error) {
        console.error('Error voting for suspect:', error);
        throw new Error('Failed to register vote');
    }
}

export async function resetVotesForSuspects(event) {
    try {
        event.locals.db.prepare("update suspects set votes = 0").run();
    } catch (error) {
        console.error('Error resetting votes:', error);
        throw new Error('Failed to reset votes');
    }
}
