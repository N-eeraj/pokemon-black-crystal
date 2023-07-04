import { appVersion } from '@/js/mixins/common'
import { setStorage } from '@/js/mixins/storage'

import versionUpdate from '@/js/mixins/migrations/versionUpdate'

import migration_v_1_8_0 from '@/js/mixins/migrations/migration_v_1_8_0'
import migration_v_1_9_2 from '@/js/mixins/migrations/migration_v_1_9_2'
import migration_v_1_9_7 from '@/js/mixins/migrations/migration_v_1_9_7'


const updateVersion = () => {
    const { currentVersion, updateIsAvailable } = versionUpdate()
    if (!updateIsAvailable) return
    setStorage('pokemon-black-crystal-version', appVersion)
    migration_v_1_8_0(currentVersion)
    migration_v_1_9_2(currentVersion)
    migration_v_1_9_7(currentVersion)
}

export default updateVersion