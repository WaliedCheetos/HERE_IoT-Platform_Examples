USE [HERE_DB]
GO
/****** Object:  StoredProcedure [dbo].[_spt_GetCongestionFactorsByLinkIds]    Script Date: 10/22/2019 3:29:07 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		WaliedCheetos
-- Create date: August 29, 2019
-- Description:	calculates congestion factor
-- =============================================
ALTER PROCEDURE [dbo].[_spt_GetCongestionFactorsByLinkIds]
	-- Add the parameters for the stored procedure here
	--link ids in a comma sepearated format (i.e. 117940263, 117899308
	@_param_LinkIds nvarchar(max)
	,
	--travel time pattern(PerHour: Per Hour/ PerDay: Per Day)
	@_param_TimePattern nvarchar(7)
	--,
	--travel direction (N: North --> to direction / S: South --> from direction)
	--@_param_Direction nvarchar(1)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF(UPPER(@_param_TimePattern) = 'PERHOUR')
		BEGIN
			--calculates congestion factor throught out the day (per hour)
			SELECT
				DATENAME(weekday, B.[DATE-TIME]) AS WeekDay,
				B.[DATE-TIME] As WeekDayDateTime,
				DATEPART(hour,B.[DATE-TIME]) As WeekDayHour,
				(FORMAT((1 - (SUM(convert(float, B.[MEAN]) / convert(float, B.[SPDLIMIT])) / (COUNT(LEFT(B.[LINK-DIR], LEN(B.[LINK-DIR])-1))))), 'P')) AS Congestion_Factor,
				RIGHT(B.[LINK-DIR], 1) AS Travel_Direction
				--, COUNT(LEFT(B.[LINK-DIR], LEN(B.[LINK-DIR])-1)) AS LinkIDs_Count
			FROM 
				HERE_DB.dbo.STREETS AS A
			INNER JOIN 
				[HERE_DB].[dbo].[Dubai_TA_14012018-20012018] AS B ON A.Link_ID = LEFT(B.[LINK-DIR], LEN(B.[LINK-DIR])-1)
			WHERE 
				--A.Link_ID IN (select value from _fx_SplitString_WithDelimiter(N'117940272, 117940273',','))
				A.Link_ID IN (select value from _fx_SplitString_WithDelimiter(@_param_LinkIds,','))
				--AND
				--RIGHT(B.[LINK-DIR], 1) =
				--	CASE UPPER(@_param_Direction)
				--		WHEN 'N' THEN 'T'
				--		WHEN 'S' THEN 'F'
				--	END
			GROUP BY
				B.[DATE-TIME], RIGHT(B.[LINK-DIR], 1)
			ORDER BY 
				B.[DATE-TIME] ASC
				;
		END

	ELSE IF (UPPER(@_param_TimePattern) = 'PERDAY')
		BEGIN
			--calculates congestion factor throught out the day (per day)
			SELECT
				DAY(B.[DATE-TIME]) AS WeekDayNumber, 
				DATENAME(weekday, B.[DATE-TIME]) AS WeekDay, 
				FORMAT((1 - (SUM(convert(float, B.[MEAN]) / convert(float, B.[SPDLIMIT])) / (COUNT(LEFT(B.[LINK-DIR], LEN(B.[LINK-DIR])-1))))), 'P') AS Congestion_Factor,
				RIGHT(B.[LINK-DIR], 1) AS Travel_Direction
				--, COUNT(B.[DATE-TIME]) AS LinkIDs_Count
			FROM 
				HERE_DB.dbo.STREETS AS A
			INNER JOIN 
				[HERE_DB].[dbo].[Dubai_TA_14012018-20012018] AS B ON A.Link_ID = LEFT(B.[LINK-DIR], LEN(B.[LINK-DIR])-1)
			WHERE 
				--A.Link_ID IN (select value from _fx_SplitString_WithDelimiter(N'117940272, 117940273',','))
				A.Link_ID IN (select value from _fx_SplitString_WithDelimiter(@_param_LinkIds,','))
				--AND
				--RIGHT(B.[LINK-DIR], 1) =
				--	CASE UPPER(@_param_Direction)
				--		WHEN 'N' THEN 'T'
				--		WHEN 'S' THEN 'F'
				--	END
			GROUP BY
				DATENAME(weekday, B.[DATE-TIME]), DAY(B.[DATE-TIME]), RIGHT(B.[LINK-DIR], 1)
			ORDER BY 
				--DATENAME(weekday, B.[DATE-TIME]) ASC
				DAY(B.[DATE-TIME]) ASC
		END
END

-- ==========================================================================================