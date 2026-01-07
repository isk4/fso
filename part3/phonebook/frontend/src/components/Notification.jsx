const Notification = ({ notification: { message, type } }) => {
    const typeColor = { success: '#bef7ffff', error: '#ff9a9aff' }[type];
    return (
        <div style={{ width: '100%', padding: 10, backgroundColor: typeColor }}>
            <span style={{ fontSize: '1.2rem' }}>{ message }</span>
        </div>
    );
};

export default Notification;