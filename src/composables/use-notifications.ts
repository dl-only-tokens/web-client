import { TYPE, useToast } from 'vue-toastification'

import { AppNotification } from '@/components/common'
import { ICON_NAME } from '@/enums'

type NotificationPayload =
  | string
  | {
      title?: string
      message: string
      iconName?: ICON_NAME
      link?: {
        label: string
        href: string
      }
    }

export const useNotifications = () => {
  const toast = useToast()

  const showToastSuccess = (payload?: NotificationPayload) => {
    showToast(TYPE.SUCCESS, payload)
  }

  const showToastError = (payload?: NotificationPayload) => {
    showToast(TYPE.ERROR, payload)
  }

  const showToastInfo = (payload?: NotificationPayload) => {
    showToast(TYPE.INFO, payload)
  }

  const showToast = (messageType: TYPE, payload?: NotificationPayload): void => {
    const payloadObj: NotificationPayload = {
      message: '',
    }

    const defaultTitlesMap = {
      [TYPE.SUCCESS]: 'Success',
      [TYPE.ERROR]: 'Error',
      [TYPE.INFO]: 'Info',
      [TYPE.WARNING]: 'Info',
      [TYPE.DEFAULT]: 'Info',
    }

    const defaultMessages = 'Notification default message'

    const defaultIconNamesMap = {
      [TYPE.SUCCESS]: ICON_NAME.notificationSuccess,
      [TYPE.ERROR]: ICON_NAME.notificationError,
      [TYPE.INFO]: ICON_NAME.notificationInfo,
      [TYPE.WARNING]: ICON_NAME.notificationInfo,
      [TYPE.DEFAULT]: ICON_NAME.notificationInfo,
    }

    if (typeof payload === 'object') {
      const msgPayload = payload

      payloadObj.title = msgPayload.title || defaultTitlesMap[messageType]
      payloadObj.message = msgPayload.message || defaultMessages
      payloadObj.iconName = msgPayload.iconName || defaultIconNamesMap[messageType]
      payloadObj.link = msgPayload.link || {
        label: '',
        href: '',
      }
    } else if (payload) {
      payloadObj.message = payload as string
    } else {
      payloadObj.message = defaultMessages
    }

    if (!payloadObj.title) {
      payloadObj.title = defaultTitlesMap[messageType]
    }

    if (!payloadObj.iconName) {
      payloadObj.iconName = defaultIconNamesMap[messageType]
    }

    toast(
      {
        component: AppNotification,
        props: payloadObj,
      },
      {
        icon: false,
        timeout: 5000,
        hideProgressBar: true,
        type: messageType,
      },
    )
  }

  return {
    showToastSuccess,
    showToastError,
    showToastInfo,
  }
}
