import {
    createSuspect,
    deleteSuspect,
    getStatus,
    getSuspects,
    resetVotesForSuspects,
    updateStatus,
    switchSuspectIsPlaying,
    updateSuspectName
} from '$lib/sqliteClient';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (event) => {
    const status = getStatus(event);
    const suspects = getSuspects(event, true);
    return { status, suspects };
};

export const actions = {
    updateStatus: async (event) => {
        const data = await event.request.formData();
        const statusStr = data.get('status') as string;

        if (!statusStr) {
            return { success: false, error: 'Status is required' };
        }

        const status = parseInt(statusStr);
        if (isNaN(status) || status < 0 || status > 2) {
            return { success: false, error: 'Invalid status value' };
        }

        try {
            updateStatus(event, status);
            return { success: true };
        } catch (error) {
            return { success: false, error: 'Failed to update status' };
        }
    },
    updateSuspectName: async (event) => {
        const data = await event.request.formData();
        const idStr = data.get('id') as string;
        const name = data.get('name') as string;

        if (!idStr || !name) {
            return { success: false, error: 'ID and name are required' };
        }

        const id = parseInt(idStr);
        if (isNaN(id) || id < 1) {
            return { success: false, error: 'Invalid suspect ID' };
        }

        if (name.trim().length === 0) {
            return { success: false, error: 'Name cannot be empty' };
        }

        try {
            updateSuspectName(event, id, name.trim());
            return { success: true };
        } catch (error) {
            return { success: false, error: 'Failed to update suspect name' };
        }
    },
    switchSuspectIsPlaying: async (event) => {
        const data = await event.request.formData();
        const idStr = data.get('id') as string;

        if (!idStr) {
            return { success: false, error: 'ID is required' };
        }

        const id = parseInt(idStr);
        if (isNaN(id) || id < 1) {
            return { success: false, error: 'Invalid suspect ID' };
        }

        try {
            switchSuspectIsPlaying(event, id);
            return { success: true };
        } catch (error) {
            return { success: false, error: 'Failed to toggle suspect status' };
        }
    },
    deleteSuspect: async (event) => {
        const data = await event.request.formData();
        const idStr = data.get('id') as string;

        if (!idStr) {
            return { success: false, error: 'ID is required' };
        }

        const id = parseInt(idStr);
        if (isNaN(id) || id < 1) {
            return { success: false, error: 'Invalid suspect ID' };
        }

        try {
            deleteSuspect(event, id);
            return { success: true };
        } catch (error) {
            return { success: false, error: 'Failed to delete suspect' };
        }
    },
    createSuspect: async (event) => {
        const data = await event.request.formData();
        const name = data.get('name') as string;

        if (!name || name.trim().length === 0) {
            return { success: false, error: 'Name is required' };
        }

        if (name.trim().length > 100) {
            return { success: false, error: 'Name is too long (max 100 characters)' };
        }

        try {
            createSuspect(event, name.trim());
            return { success: true };
        } catch (error) {
            return { success: false, error: 'Failed to create suspect' };
        }
    },
    resetVotes: async (event) => {
        try {
            resetVotesForSuspects(event);
            return { success: true };
        } catch (error) {
            return { success: false, error: 'Failed to reset votes' };
        }
    }
};
