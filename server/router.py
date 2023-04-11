class Solution:
    def searchInsert(self, nums: list[int], target: int) -> int:
        l, r = 0, len(nums)-1
        while l <= r:
            mid = (l + r) // 2
            print(mid)
            if nums[mid] < target:
                l = mid + 1
            elif nums[mid] > target:
                r = mid - 1
            else:
                return mid
        return l
    

x = Solution()
print(x.searchInsert([1,3,5,6], 2))