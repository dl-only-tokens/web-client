import { useToast } from 'vue-toastification'

import { AppNotification } from '@/components/common'
import { ICON_NAMES } from '@/enums'

type NotificationObjectPayload = {
  title?: string
  message: string
  iconName?: ICON_NAMES
  link?: {
    label: string
    href: string
  }
}

enum TYPE {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
}

export const useNotifications = () => {
  const toast = useToast()

  const showToastSuccess = (payload?: string | NotificationObjectPayload) => {
    showToast(TYPE.SUCCESS, payload)
  }

  const showToastError = (payload?: string | NotificationObjectPayload) => {
    showToast(TYPE.ERROR, payload)
  }

  const showToastInfo = (payload?: string | NotificationObjectPayload) => {
    showToast(TYPE.INFO, payload)
  }

  const showToast = (messageType: TYPE, payload?: string | NotificationObjectPayload): void => {
    let title = ''
    let message = ''
    let iconName = ''
    let link = {
      label: '',
      href: '',
    }

    const defaultTitles = {
      [TYPE.SUCCESS]: 'Success',
      [TYPE.ERROR]: 'Error',
      [TYPE.INFO]: 'Info',
    }

    const defaultMessages = 'Notification default message'

    const defaultIconNames = {
      [TYPE.SUCCESS]: ICON_NAMES.notificationSuccess,
      [TYPE.ERROR]: ICON_NAMES.notificationError,
      [TYPE.INFO]: ICON_NAMES.notificationInfo,
    }

    if (typeof payload === 'object') {
      const msgPayload = payload as NotificationObjectPayload

      title = msgPayload.title || defaultTitles[messageType]
      message = msgPayload.message || defaultMessages
      iconName = msgPayload.iconName || defaultIconNames[messageType]
      link = msgPayload.link || {
        label: '',
        href: '',
      }
    } else if (payload) {
      message = payload as string
    } else {
      message = defaultMessages
    }

    if (!title) {
      title = defaultTitles[messageType]
    }

    if (!iconName) {
      iconName = defaultIconNames[messageType]
    }

    toast(
      {
        component: AppNotification,
        props: {
          title,
          message,
          iconName,
          link,
        },
      },
      {
        icon: false,
        timeout: 3000,
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
