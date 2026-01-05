const Notification = ({ message }) => {
    return (
        <div style={{ width: '100%', padding: 10, backgroundColor: '#eee' }}>
            <span style={{ fontSize: '1.2rem' }}>{ message }</span>
        </div>
    );
};

export default Notification;