import {reactive} from "vue"

let messageStoreInstance = null

function createMessageStore() {
    const messages = reactive([])
    const pushMessage = message => {
        messages.push(message)
        setTimeout(
            () => {
                messages.pop()
            },
            4000
        )
    }

    return {
        messages,
        pushMessage
    }
}

export default function () {
    if (!messageStoreInstance) {
        messageStoreInstance = createMessageStore()
    }

    return messageStoreInstance
}
