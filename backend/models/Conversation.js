const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        },
        lastMessageAt: {
            type: Date,
            default: Date.now,
        },
        // canonical thread key for ordered participant pair, e.g. "id1_id2"
        threadKey: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        deletedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
    }
);

ConversationSchema.index({ participants: 1 });

// Ensure a canonical threadKey is generated from sorted participant ids
ConversationSchema.pre('validate', function () {
    try {
        if (!this.threadKey || typeof this.threadKey !== 'string') {
            const ids = (this.participants || []).map((p) => (p._id ? p._id.toString() : p.toString()));
            if (ids.length >= 2) {
                ids.sort();
                this.threadKey = `${ids[0]}_${ids[1]}`;
            }
        }
    } catch (err) {
        // swallow and let validation handle missing data
    }
    return;
});

module.exports = mongoose.model('Conversation', ConversationSchema);