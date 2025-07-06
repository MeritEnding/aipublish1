import { defineStore } from 'pinia';
import axios from '@axios';

export const useWriterStore = defineStore('writer', {
  state: () => ({
    // 관리자용: 작가 신청자 목록
    candidates: [], 
    // 사용자용: 나의 신청 상태 ('PENDING', 'APPROVED', 'REJECTED')
    applicationStatus: null, 
    // 사용자용: 내가 최종 승인된 작가인지 여부
    isApprovedWriter: false,
    isLoading: false,
  }),
  getters: {
    writerCandidates: (state) => state.candidates,
    currentApplicationStatus: (state) => state.applicationStatus,
    isApproved: (state) => state.isApprovedWriter,
  },
  actions: {
    /**
     * [관리자] 작가 신청 목록을 조회합니다.
     * API: GET /admin/writers?adminId={userid}
     */
    async fetchCandidates(adminId) {
      if (!adminId) throw new Error("관리자 ID가 필요합니다.");
      this.isLoading = true;
      try {
        const response = await axios.get('/admin/writers', { params: { adminId } });
        this.candidates = response.data;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * [관리자] 작가의 상태(승인/반려)를 변경합니다.
     * API: PATCH /admin/writers/{writerid}/status?adminId={userid}
     */
    async updateStatus({ adminId, candidateId, newStatus }) {
      const payload = { status: newStatus };
      await axios.patch(`/admin/writers/${candidateId}/status`, payload, { params: { adminId } });
      // 상태 변경 후, 목록을 자동으로 다시 불러와 화면을 갱신합니다.
      await this.fetchCandidates(adminId);
    },

    /**
     * [사용자] 현재 내가 최종 승인된 작가인지 확인합니다.
     * API: GET /writers/{userId}/isApproved
     */
    async checkApprovalStatus(userId) {
      if (!userId) return;
      try {
        const response = await axios.get(`/writers/${userId}/isApproved`);
        this.isApprovedWriter = response.data; // true 또는 false
      } catch (error) {
        this.isApprovedWriter = false;
      }
    },

    /**
     * [사용자] 작가 등록을 신청합니다.
     * API: POST /writers/apply
     */
    async submitApplication(payload) { // payload: { userId, bio }
      this.isLoading = true;
      try {
        const response = await axios.post('/writers/apply', payload);
        // 신청이 성공하면, 나의 신청 상태를 'PENDING'으로 즉시 업데이트합니다.
        this.applicationStatus = response.data.status; 
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * [사용자] 나의 신청서 상세 상태(PENDING 등)를 확인하기 위해 추가된 메소드입니다.
     * (백엔드의 findById를 사용)
     */
    async checkMyApplicationStatus(userId) {
        if (!userId) return;
        this.isLoading = true;
        try {
            // Spring Data REST는 findById를 /writer-candidates/{id} 경로로 기본 제공합니다.
            const response = await axios.get(`/writer-candidates/${userId}`);
            this.applicationStatus = response.data?.status || null;
        } catch (error) {
            // 404 에러는 신청 내역이 없는 것이므로 정상적인 상태입니다.
            if (error.response && error.response.status === 404) {
                this.applicationStatus = null;
            }
        } finally {
            this.isLoading = false;
        }
    }
  },
});