import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from "expo-router";

const { width, height } = Dimensions.get('window');

export default function CameraSettingsScreen() {
    const router = useRouter();
    const [settings, setSettings] = useState({
        // Stream Settings
        streamUrl: '',
        streamQuality: '720p',
        autoReconnect: true,
        bufferSize: '2MB',
        connectionTimeout: 30,

        // Video Settings
        videoQuality: '720p',
        frameRate: 30,
        bitrate: '2Mbps',
        resolution: '1280x720',

        // Audio Settings
        audioEnabled: true,
        audioQuality: 'High',
        microphoneEnabled: true,

        // Recording Settings
        autoRecord: false,
        recordDuration: 60,
        maxRecordings: 10,
        saveToGallery: true,

        // Notification Settings
        motionDetection: true,
        soundAlerts: true,
        pushNotifications: true,
        emailAlerts: false,

        // Storage Settings
        autoSave: true,
        cloudSync: false,
        maxStorage: '5GB',
        compressionLevel: 'Medium',

        // Privacy Settings
        locationTracking: false,
        faceDetection: true,
        dataEncryption: true,
    });

    const updateSetting = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        console.log(`Setting updated: ${key} = ${value}`);

        // Show feedback for important settings
        if (key === 'motionDetection' && value) {
            Alert.alert('Phát hiện chuyển động', 'Tính năng phát hiện chuyển động đã được bật!');
        } else if (key === 'soundAlerts' && value) {
            Alert.alert('Âm thanh cảnh báo', 'Âm thanh cảnh báo đã được bật!');
        } else if (key === 'cloudSync' && value) {
            Alert.alert('Đồng bộ đám mây', 'Tính năng đồng bộ đám mây đã được bật!');
        } else if (key === 'locationTracking' && value) {
            Alert.alert('Theo dõi vị trí', 'Tính năng theo dõi vị trí đã được bật!');
        }
    };

    const resetSettings = () => {
        Alert.alert(
            'Reset Settings',
            'Bạn có chắc muốn reset tất cả cài đặt về mặc định?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: () => {
                        setSettings({
                            streamUrl: '',
                            streamQuality: '720p',
                            autoReconnect: true,
                            bufferSize: '2MB',
                            connectionTimeout: 30,
                            videoQuality: '720p',
                            frameRate: 30,
                            bitrate: '2Mbps',
                            resolution: '1280x720',
                            audioEnabled: true,
                            audioQuality: 'High',
                            microphoneEnabled: true,
                            autoRecord: false,
                            recordDuration: 60,
                            maxRecordings: 10,
                            saveToGallery: true,
                            motionDetection: true,
                            soundAlerts: true,
                            pushNotifications: true,
                            emailAlerts: false,
                            autoSave: true,
                            cloudSync: false,
                            maxStorage: '5GB',
                            compressionLevel: 'Medium',
                            locationTracking: false,
                            faceDetection: true,
                            dataEncryption: true,
                        });
                        console.log('Settings reset to default');
                        Alert.alert('Thành công', 'Đã reset cài đặt về mặc định');
                    }
                }
            ]
        );
    };

    const saveSettings = () => {
        // Simulate saving settings
        console.log('Saving settings:', settings);
        Alert.alert(
            'Lưu cài đặt',
            'Cài đặt đã được lưu thành công!',
            [{ text: 'OK' }]
        );
    };

    const exportSettings = () => {
        // Simulate exporting settings
        const settingsJson = JSON.stringify(settings, null, 2);
        console.log('Exporting settings:', settingsJson);
        Alert.alert(
            'Xuất cài đặt',
            'Cài đặt đã được xuất thành công!\n\nBạn có thể tìm thấy file cài đặt trong thư mục Downloads.',
            [{ text: 'OK' }]
        );
    };

    const showSettingsInfo = () => {
        const activeSettings = Object.entries(settings)
            .filter(([key, value]) => value === true)
            .map(([key, value]) => key)
            .join(', ');

        Alert.alert(
            'Thông tin cài đặt',
            `Cài đặt hiện tại:\n\n• URL Stream: ${settings.streamUrl ? 'Đã cấu hình' : 'Chưa cấu hình'}\n• Chất lượng stream: ${settings.streamQuality}\n• Tự động kết nối lại: ${settings.autoReconnect ? 'Bật' : 'Tắt'}\n• Chất lượng video: ${settings.videoQuality}\n• Tốc độ khung hình: ${settings.frameRate} FPS\n• Bitrate: ${settings.bitrate}\n• Bật âm thanh: ${settings.audioEnabled ? 'Bật' : 'Tắt'}\n• Tự động ghi: ${settings.autoRecord ? 'Bật' : 'Tắt'}\n• Thời gian ghi: ${settings.recordDuration}s\n• Phát hiện chuyển động: ${settings.motionDetection ? 'Bật' : 'Tắt'}\n• Thông báo đẩy: ${settings.pushNotifications ? 'Bật' : 'Tắt'}\n• Tự động lưu: ${settings.autoSave ? 'Bật' : 'Tắt'}\n• Đồng bộ đám mây: ${settings.cloudSync ? 'Bật' : 'Tắt'}\n• Dung lượng tối đa: ${settings.maxStorage}\n• Mã hóa dữ liệu: ${settings.dataEncryption ? 'Bật' : 'Tắt'}`,
            [{ text: 'OK' }]
        );
    };

    const SettingItem = ({
        title,
        subtitle,
        value,
        onValueChange,
        type = 'switch',
        options = []
    }: {
        title: string;
        subtitle?: string;
        value: any;
        onValueChange: (value: any) => void;
        type?: 'switch' | 'select' | 'number';
        options?: string[];
    }) => (
        <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{title}</Text>
                {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
            </View>
            <View style={styles.settingControl}>
                {type === 'switch' ? (
                    <Switch
                        value={value}
                        onValueChange={onValueChange}
                        trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                        thumbColor={value ? '#fff' : '#f4f3f4'}
                    />
                ) : type === 'select' ? (
                    <TouchableOpacity
                        style={styles.selectButton}
                        onPress={() => {
                            Alert.alert(
                                title,
                                'Chọn tùy chọn:',
                                options.map(option => ({
                                    text: option,
                                    onPress: () => onValueChange(option)
                                }))
                            );
                        }}
                    >
                        <Text style={styles.selectText}>{value}</Text>
                        <Ionicons name="chevron-down" size={16} color="#007AFF" />
                    </TouchableOpacity>
                ) : (
                    <Text style={styles.settingValue}>{value}</Text>
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <Stack.Screen options={{ title: "Cài đặt camera" }} />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Stream Settings */}
                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={() => {
                            Alert.prompt(
                                'URL Stream HLS',
                                'Nhập link stream HLS của camera:',
                                [
                                    { text: 'Hủy', style: 'cancel' },
                                    {
                                        text: 'Lưu',
                                        onPress: (text: string | undefined) => updateSetting('streamUrl', text || '')
                                    }
                                ],
                                'plain-text',
                                settings.streamUrl
                            );
                        }}
                    >
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>URL Stream HLS</Text>
                            <Text style={styles.settingSubtitle}>Link stream camera nhà</Text>
                        </View>
                        <View style={styles.settingControl}>
                            <Text style={styles.settingValue}>
                                {settings.streamUrl ? 'Đã cấu hình' : 'Chưa cấu hình'}
                            </Text>
                            <Ionicons name="chevron-forward" size={16} color="#007AFF" style={{ marginLeft: 4 }} />
                        </View>
                    </TouchableOpacity>

                    <SettingItem
                        title="Chất lượng stream"
                        subtitle="Chất lượng video streaming"
                        value={settings.streamQuality}
                        onValueChange={(value) => updateSetting('streamQuality', value)}
                        type="select"
                        options={['480p', '720p', '1080p', '4K']}
                    />

                    <SettingItem
                        title="Tự động kết nối lại"
                        subtitle="Tự động kết nối lại khi mất kết nối"
                        value={settings.autoReconnect}
                        onValueChange={(value) => updateSetting('autoReconnect', value)}
                    />

                    <SettingItem
                        title="Kích thước buffer"
                        subtitle="Dung lượng buffer video"
                        value={settings.bufferSize}
                        onValueChange={(value) => updateSetting('bufferSize', value)}
                        type="select"
                        options={['1MB', '2MB', '4MB', '8MB']}
                    />
                </View>

                {/* Video Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cài đặt Video</Text>

                    <SettingItem
                        title="Chất lượng video"
                        subtitle="Chất lượng ghi video"
                        value={settings.videoQuality}
                        onValueChange={(value) => updateSetting('videoQuality', value)}
                        type="select"
                        options={['480p', '720p', '1080p', '4K']}
                    />

                    <SettingItem
                        title="Tốc độ khung hình"
                        subtitle="FPS của video"
                        value={settings.frameRate}
                        onValueChange={(value) => updateSetting('frameRate', value)}
                        type="select"
                        options={['15', '24', '30', '60']}
                    />

                    <SettingItem
                        title="Bitrate"
                        subtitle="Tốc độ bit video"
                        value={settings.bitrate}
                        onValueChange={(value) => updateSetting('bitrate', value)}
                        type="select"
                        options={['1Mbps', '2Mbps', '4Mbps', '8Mbps']}
                    />

                    <SettingItem
                        title="Độ phân giải"
                        subtitle="Kích thước video"
                        value={settings.resolution}
                        onValueChange={(value) => updateSetting('resolution', value)}
                        type="select"
                        options={['640x480', '1280x720', '1920x1080', '3840x2160']}
                    />
                </View>

                {/* Audio Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cài đặt Âm thanh</Text>

                    <SettingItem
                        title="Bật âm thanh"
                        subtitle="Phát âm thanh từ camera"
                        value={settings.audioEnabled}
                        onValueChange={(value) => updateSetting('audioEnabled', value)}
                    />

                    <SettingItem
                        title="Chất lượng âm thanh"
                        subtitle="Chất lượng audio"
                        value={settings.audioQuality}
                        onValueChange={(value) => updateSetting('audioQuality', value)}
                        type="select"
                        options={['Low', 'Medium', 'High', 'Lossless']}
                    />

                    <SettingItem
                        title="Microphone"
                        subtitle="Ghi âm từ microphone"
                        value={settings.microphoneEnabled}
                        onValueChange={(value) => updateSetting('microphoneEnabled', value)}
                    />
                </View>

                {/* Recording Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cài đặt Ghi hình</Text>

                    <SettingItem
                        title="Tự động ghi"
                        subtitle="Tự động bắt đầu ghi khi có chuyển động"
                        value={settings.autoRecord}
                        onValueChange={(value) => updateSetting('autoRecord', value)}
                    />

                    <SettingItem
                        title="Thời gian ghi"
                        subtitle="Thời gian ghi video (giây)"
                        value={settings.recordDuration}
                        onValueChange={(value) => updateSetting('recordDuration', value)}
                        type="select"
                        options={['30', '60', '120', '300', '600']}
                    />

                    <SettingItem
                        title="Số bản ghi tối đa"
                        subtitle="Số lượng bản ghi lưu trữ"
                        value={settings.maxRecordings}
                        onValueChange={(value) => updateSetting('maxRecordings', value)}
                        type="select"
                        options={['5', '10', '20', '50', '100']}
                    />

                    <SettingItem
                        title="Lưu vào thư viện"
                        subtitle="Tự động lưu vào thư viện ảnh"
                        value={settings.saveToGallery}
                        onValueChange={(value) => updateSetting('saveToGallery', value)}
                    />
                </View>

                {/* Notification Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông báo</Text>

                    <SettingItem
                        title="Phát hiện chuyển động"
                        subtitle="Cảnh báo khi có chuyển động"
                        value={settings.motionDetection}
                        onValueChange={(value) => updateSetting('motionDetection', value)}
                    />

                    <SettingItem
                        title="Âm thanh cảnh báo"
                        subtitle="Phát âm thanh khi có sự kiện"
                        value={settings.soundAlerts}
                        onValueChange={(value) => updateSetting('soundAlerts', value)}
                    />

                    <SettingItem
                        title="Thông báo đẩy"
                        subtitle="Nhận thông báo trên điện thoại"
                        value={settings.pushNotifications}
                        onValueChange={(value) => updateSetting('pushNotifications', value)}
                    />

                    <SettingItem
                        title="Email cảnh báo"
                        subtitle="Gửi email khi có sự kiện"
                        value={settings.emailAlerts}
                        onValueChange={(value) => updateSetting('emailAlerts', value)}
                    />
                </View>

                {/* Storage Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Lưu trữ</Text>

                    <SettingItem
                        title="Tự động lưu"
                        subtitle="Tự động lưu ảnh và video"
                        value={settings.autoSave}
                        onValueChange={(value) => updateSetting('autoSave', value)}
                    />

                    <SettingItem
                        title="Đồng bộ đám mây"
                        subtitle="Tự động tải lên đám mây"
                        value={settings.cloudSync}
                        onValueChange={(value) => updateSetting('cloudSync', value)}
                    />

                    <SettingItem
                        title="Dung lượng tối đa"
                        subtitle="Giới hạn dung lượng lưu trữ"
                        value={settings.maxStorage}
                        onValueChange={(value) => updateSetting('maxStorage', value)}
                        type="select"
                        options={['1GB', '5GB', '10GB', '50GB', 'Không giới hạn']}
                    />

                    <SettingItem
                        title="Mức độ nén"
                        subtitle="Mức độ nén video"
                        value={settings.compressionLevel}
                        onValueChange={(value) => updateSetting('compressionLevel', value)}
                        type="select"
                        options={['Low', 'Medium', 'High', 'Maximum']}
                    />
                </View>

                {/* Privacy Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Bảo mật & Quyền riêng tư</Text>

                    <SettingItem
                        title="Theo dõi vị trí"
                        subtitle="Ghi lại vị trí GPS"
                        value={settings.locationTracking}
                        onValueChange={(value) => updateSetting('locationTracking', value)}
                    />

                    <SettingItem
                        title="Nhận diện khuôn mặt"
                        subtitle="Tự động nhận diện người"
                        value={settings.faceDetection}
                        onValueChange={(value) => updateSetting('faceDetection', value)}
                    />

                    <SettingItem
                        title="Mã hóa dữ liệu"
                        subtitle="Mã hóa dữ liệu video"
                        value={settings.dataEncryption}
                        onValueChange={(value) => updateSetting('dataEncryption', value)}
                    />
                </View>

                {/* Action Buttons */}
                <View style={styles.actionSection}>
                    <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
                        <Ionicons name="checkmark" size={20} color="#fff" />
                        <Text style={styles.saveButtonText}>Lưu cài đặt</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.exportButton} onPress={exportSettings}>
                        <Ionicons name="download" size={20} color="#007AFF" />
                        <Text style={styles.exportButtonText}>Xuất cài đặt</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerButton: {
        padding: 8,
    },
    headerCenter: {
        alignItems: 'center',
        flex: 1,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#000',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 2,
    },
    headerSubtitle: {
        color: '#8E8E93',
        fontSize: 12,
    },
    scrollView: {
        flex: 1,
    },
    section: {
        backgroundColor: '#fff',
        marginTop: 16,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingInfo: {
        flex: 1,
        marginRight: 16,
    },
    settingTitle: {
        color: '#000',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 2,
    },
    settingSubtitle: {
        color: '#8E8E93',
        fontSize: 12,
    },
    settingControl: {
        alignItems: 'flex-end',
    },
    selectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    selectText: {
        color: '#007AFF',
        fontSize: 14,
        marginRight: 4,
    },
    settingValue: {
        color: '#8E8E93',
        fontSize: 14,
    },
    actionSection: {
        padding: 16,
        gap: 12,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    exportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#007AFF',
        gap: 8,
    },
    exportButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },
    // Additional styles for new features
    streamUrlInput: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 14,
        color: '#333',
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    connected: {
        backgroundColor: '#28a745',
    },
    disconnected: {
        backgroundColor: '#dc3545',
    },
    warningText: {
        color: '#ffc107',
        fontSize: 12,
        fontStyle: 'italic',
    },
});