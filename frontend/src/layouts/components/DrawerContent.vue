<script setup>
import {
  VerticalNavLink,
  VerticalNavSectionTitle,
} from '@layouts'
</script>

<template>
    <ul>
        <VerticalNavSectionTitle :item="{ heading: '작가 등록/관리' }" />
        <VerticalNavLink
            :item="{
                title: '작가등록',
                to: '/writers/apply',
            }"
        />
        <VerticalNavSectionTitle :item="{ heading: '회원 관리' }" />
        <VerticalNavLink
            :item="{
                title: '관리자',
                to: '/admin/writer_management',
            }"
        />
        <VerticalNavLink
            :item="{
                title: '마이페이지 조회',
                to: '/viewMyPages',
            }"
        />
        <VerticalNavSectionTitle :item="{ heading: '원고 작성/출간요청' }" />
        <VerticalNavLink
            :item="{
                title: '원고',
                to: '/books',
            }"
        />
        <VerticalNavLink
            :item="{
                title: '원고 상세 정보',
                to: '/bookDetails',
            }"
        />
        <VerticalNavSectionTitle :item="{ heading: 'AI 자동화' }" />
        <VerticalNavLink
            :item="{
                title: 'AI 전자책 프로세서',
                to: '/aiBookProcessors',
            }"
        />
        <VerticalNavSectionTitle :item="{ heading: '도서관리' }" />
        <VerticalNavLink
            :item="{
                title: '도서 관리',
                to: '/book_mangement',
            }"
        />
        <VerticalNavSectionTitle :item="{ heading: '요금제' }" />
        <VerticalNavLink
            :item="{
                title: '요금제',
                to: '/billing',
            }"
        />


        
    </ul>
</template>
