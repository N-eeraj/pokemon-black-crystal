import { appVersion } from '@/js/mixins/common'
import { getStorage } from '@/js/mixins/storage'

const versionUpdate = () => {
    const currentVersion = getStorage('pokemon-black-crystal-version') || getStorage('version')
    return {
        currentVersion,
        updateIsAvailable: !(currentVersion && currentVersion === appVersion)
    }
}

export default versionUpdate