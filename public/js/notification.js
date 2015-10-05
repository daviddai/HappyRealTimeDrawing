function showNotification(notificationType) {
    var notif = null;
    
    if (notificationType == CLEAR_NOTIFICATION) {
        notif = createClearNotification();
    }

    if (notif != null) {
        $.notify(notif['title'], {
            clickToHide: notif['clickToHide'],
            autoHide: notif['autoHide'],
            autoHideDelay: notif['autoHideDelay'],
            showAnimation: notif['showAnimation'],
            hideAnimation: notif['hideAnimation']
        });
    }
}

function createClearNotification() {
    return {
                'title': 'Opposite user cleared the board',
                'clickToHide': true,
                'autoHide': true,
                'auoHideDelay': 2000,
                'showAnimation': 'slideDown',
                'hideAnimation': 'slideUp'
            };
}
