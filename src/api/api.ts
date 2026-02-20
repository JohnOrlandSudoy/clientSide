const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const SERVER_ORIGIN = (() => {
    try {
        const u = new URL(BASE_URL);
        // Remove trailing /api if present
        return `${u.protocol}//${u.host}`;
    } catch {
        return 'http://localhost:3001';
    }
})();

export function toServerFileUrl(path: string | null | undefined) {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/uploads')) return `${SERVER_ORIGIN}${path}`;
    return path;
}

export interface VerifyPayload {
	id: string;
	pin: string;
}

export async function getPublicProfile(uniqueCode: string) {
	const res = await fetch(`${BASE_URL}/profiles/${encodeURIComponent(uniqueCode)}`);
	if (!res.ok) {
		let msg = `HTTP ${res.status}`;
		try { const e = await res.json(); msg = e.error || msg; } catch {}
		throw new Error(msg);
	}
	return res.json();
}

export async function verifyCredentials(uniqueCode: string, payload: VerifyPayload) {
	const res = await fetch(`${BASE_URL}/profiles/${encodeURIComponent(uniqueCode)}/verify`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});
	if (!res.ok) {
		let msg = `HTTP ${res.status}`;
		try { const e = await res.json(); msg = e.error || msg; } catch {}
		throw new Error(msg);
	}
	return res.json();
}

export async function verifyById(payload: VerifyPayload) {
    const res = await fetch(`${BASE_URL}/profiles/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try { const e = await res.json(); msg = e.error || msg; } catch {}
        throw new Error(msg);
    }
    return res.json();
}

export async function updateProfile(uniqueCode: string, payload: Record<string, any>) {
    const res = await fetch(`${BASE_URL}/profiles/${encodeURIComponent(uniqueCode)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try { const e = await res.json(); msg = e.error || msg; } catch {}
        throw new Error(msg);
    }
    return res.json();
}

export async function uploadProfilePhoto(uniqueCode: string, file: File) {
    const form = new FormData();
    form.append('photo', file);
    const res = await fetch(`${BASE_URL}/profiles/${encodeURIComponent(uniqueCode)}/upload`, {
        method: 'POST',
        body: form,
    });
    if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try { const e = await res.json(); msg = e.error || msg; } catch {}
        throw new Error(msg);
    }
    return res.json();
}
