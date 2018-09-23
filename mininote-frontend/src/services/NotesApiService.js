const apiBaseUrl = '/api/'

export default {
    list: function() {
        let req = new Request(apiBaseUrl + 'notebook', { method: 'GET' })
        return fetch(req)
            .then(res => {
                return res.json()
            })
    },
    delete: function(notebookId, passwordHash) {
        let headers = new Headers()
        headers.append('Authorization', 'Basic ' + passwordHash)
        let req = new Request(apiBaseUrl + 'notebook/' + notebookId, { method: 'DELETE', headers: headers })
        return fetch(req)
            .then(res => {
                if (res.status === 200) return res.json()
                else if (res.status === 404) throw Error("No notebook found to delete")
                else if (res.status === 401) throw Error("Password incorrect")
                else throw Error("Something went wrong. Sorry!")
            })
    },
    exists: function(notebookId) {
        let req = new Request(apiBaseUrl + 'notebook/' + notebookId, { method: 'HEAD' })
        return fetch(req)
            .then(res => {
                return res.status === 200
            })
    },
    create: function(notebookId, passwordHash) {
        let headers = new Headers()
        headers.append('Content-Type', 'application/json')
        let req = new Request(apiBaseUrl + 'notebook', { method: 'POST', body: JSON.stringify({ id: notebookId, password: passwordHash }), headers: headers })
        return fetch(req)
            .then(res => {
                if (res.status === 201) return res.json()
                else return null
            })
    },
    getNotes: function(notebookId, passwordHash) {
        let headers = new Headers()
        headers.append('Authorization', 'Basic ' + passwordHash)
        let req = new Request(apiBaseUrl + 'notebook/' + notebookId + '/notes/', { method: 'GET', headers: headers, mode: 'cors' })
        return fetch(req)
            .then(res => {
                if (res.status === 200) return res.json()
                else if (res.status === 401) return 'unauthorized'
                else return null
            })
    },
    updateNotes: function(notebookId, passwordHash, notes) {
        let headers = new Headers()
        headers.append('Authorization', 'Basic ' + passwordHash)
        headers.append('Content-Type', 'application/json')
        let req = new Request(apiBaseUrl + 'notebook/' + notebookId + '/notes', { method: 'PUT', body: JSON.stringify(notes), headers: headers })
        return fetch(req)
            .then(res => {
                if (res.status === 200) return res.json()
                else if (res.status === 401) return 'unauthorized'
                else return null
            })
    },
    updateSettings: function(notebookId, passwordHash, settings) {
        let headers = new Headers()
        headers.append('Authorization', 'Basic ' + passwordHash)
        headers.append('Content-Type', 'application/json')
        let req = new Request(apiBaseUrl + 'notebook/' + notebookId + '/settings', { method: 'PUT', body: JSON.stringify(settings), headers: headers })
        return fetch(req)
            .then(res => {
                if (res.status === 200) return res.json()
                else if (res.status === 401) return 'unauthorized'
                else return null
            })
    }
}
